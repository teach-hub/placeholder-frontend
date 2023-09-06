import {
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-relay';

import logo from 'assets/logo_wo_text.png';

import LoginMutationDef from 'graphql/LoginMutation';
import RegisterMutationDef from 'graphql/RegisterUserMutation';

import { storeRemoveValue, storeGetValue, storeSetValue } from 'hooks/useLocalStorage';
import useToast from 'hooks/useToast';

import { FormErrors, Mutable } from 'types';

import Button from 'components/Button';
import Form from 'components/Form';
import InputField from 'components/InputField';

import type {
  LoginMutation,
  LoginMutation$data,
} from '__generated__/LoginMutation.graphql';
import type {
  RegisterUserMutation,
  RegisterUserMutation$data,
} from '__generated__/RegisterUserMutation.graphql';

type RegisterData = {
  name?: string;
  lastName?: string;
  file?: string;
  notificationEmail?: string;
  githubId?: string;
};

type Props = {
  initialValues: RegisterData;
};

type LoginPageProps = {
  redirectTo?: string;
};

// Este form functiona de la siguiente forma
// - Redireccionamos al usuario a la pagina de github para que se loguee. (Linea 20).
// - Cuando el usuario se loguea, github nos redirecciona a la pagina con un codigo en la url.
// - Si el codigo esta en la url, hacemos un request a nuestro backend para intercambiar el codigo por un token.
// - Si el usuario no esta registrado, el backend nos devuelve un error y mostramos el form de registro.
// - Si el usuario esta registrado, el backend nos devuelve un token y lo guardamos en el local storage.

const LoginPage = (props: LoginPageProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [commitLoginMutation, isLoginMutationInFlight] =
    useMutation<LoginMutation>(LoginMutationDef);
  const navigate = useNavigate();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [data, setData] = useState({ errorMessage: '', isLoading: false });

  const CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID || 'fake-id';
  const SCOPE = process.env.REACT_APP_GITHUB_SCOPE || 'repo';

  const handleGithubLogin = () => {
    props.redirectTo && storeSetValue('redirectTo', props.redirectTo);
    setIsLoggingIn(true);
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
  };

  const loginAndRedirect = async (code: string) => {
    commitLoginMutation({
      variables: { code },
      onCompleted: (response: LoginMutation$data, errors) => {
        if (!errors?.length || response.login?.token) {
          const token = response.login?.token;
          const userRegistered = response.login?.userRegistered || false;

          // Set token either if user is logged in, or sign up is required.
          token && storeSetValue('token', token);

          if (userRegistered) {
            setIsLoggingIn(false);

            // Volvemos a la pagina de la que venimos.
            navigate(storeGetValue('redirectTo') ? storeGetValue('redirectTo')! : '/');
          } else {
            onOpen(); // Open register form
          }
        } else {
          toast({
            title: 'Error',
            description: `No ha sido posible ingresar: ${errors[0].message}`,
            status: 'error',
          });
        }
      },
    });
  };

  useEffect(() => {
    if (!isLoggingIn && !isLoginMutationInFlight) {
      const url = window.location.href;
      const hasCode = url.includes('?code='); // Get Github code

      // If Github API returns the code parameter
      if (hasCode) {
        const newUrl = url.split('?code=');
        window.history.pushState({}, '', newUrl[0]);
        setData({ ...data, isLoading: true });

        const requestData = {
          code: newUrl[1],
        };

        loginAndRedirect(requestData.code);
      }
    }
  }, [isLoggingIn, isLoginMutationInFlight]);

  if (isLoggingIn || isLoginMutationInFlight) {
    return <div>Logging in...</div>;
  }

  const RegisterForm = ({ initialValues }: Props): JSX.Element => {
    const [hasFile, setHasFile] = useState(true);
    const [commitRegisterMutation] =
      useMutation<RegisterUserMutation>(RegisterMutationDef);

    type FormValues = Mutable<NonNullable<RegisterData>>;

    const validateForm = (values: FormValues): FormErrors<FormValues> => {
      const errors: FormErrors<FormValues> = {};

      if (!values?.name) {
        errors.name = 'Obligatorio';
      }
      if (!values?.lastName) {
        errors.lastName = 'Obligatorio';
      }
      if (!values?.file && hasFile) {
        errors.file = 'Obligatorio';
      }

      return errors;
    };

    const onSubmit = (variables: FormValues) => {
      commitRegisterMutation({
        variables: {
          ...variables,
          file: variables.file ? String(variables.file) : variables.file,
        },
        onCompleted: (response: RegisterUserMutation$data, errors) => {
          const token = response.registerUser?.token;
          if (!errors?.length) {
            token && storeSetValue('token', token);
            onClose(); // Close modal
            const redirectTo = storeGetValue('redirectTo');
            navigate(redirectTo ? redirectTo : '/');
            toast({
              title: 'Usuario registrado!',
              status: 'success',
            });
          } else {
            storeRemoveValue('token'); // If register failed remove token
            onClose();
            toast({
              title: 'Error',
              description: `No ha sido posible registrarse: ${errors[0].message}`,
              status: 'error',
            });
          }
        },
      });
    };

    return (
      <Flex direction="column" gap={'30px'}>
        <Flex width={'full'} justifyContent={'flex-start'} gap={'20px'}>
          <Text fontWeight="bold">¿Tenes padrón?</Text>
          <Switch
            id="has-file"
            isChecked={hasFile}
            onChange={() => setHasFile(!hasFile)}
          />
        </Flex>
        <Form
          buttonsEnabled={true}
          initialValues={{
            name: initialValues.name || '',
            lastName: initialValues.lastName || '',
            file: initialValues.file || '',
            notificationEmail: initialValues.notificationEmail || '',
          }}
          validateForm={validateForm}
          onCancelForm={{
            text: 'Cancelar',
            onClick: onClose,
          }}
          onSubmitForm={{
            text: 'Registrarme',
            onClick: onSubmit,
          }}
          inputFields={[
            {
              inputComponent: (values, handleChange) => (
                <InputField
                  id={'name'}
                  value={values?.name}
                  onChange={handleChange}
                  placeholder={'Nombre'}
                  type={'text'}
                />
              ),
              label: 'Nombre',
              readError: e => e.name as string,
            },
            {
              inputComponent: (values, handleChange) => (
                <InputField
                  id={'lastName'}
                  value={values?.lastName}
                  onChange={handleChange}
                  placeholder={'Apellido'}
                  type={'text'}
                />
              ),
              label: 'Apellido',
              readError: e => e.lastName as string,
            },
            {
              inputComponent: (values, handleChange) => (
                <InputField
                  id={'notificationEmail'}
                  value={values?.notificationEmail}
                  onChange={handleChange}
                  placeholder={'mail@mail.com'}
                  type={'email'}
                />
              ),
              label: 'Email (notificaciones)',
              readError: e => e.notificationEmail as string,
            },
            {
              inputComponent: (values, handleChange) => (
                <InputField
                  id={'file'}
                  value={values?.file}
                  onChange={handleChange}
                  placeholder={'12345'}
                  type={'number'}
                  pattern={'[0-9]*'} // allow only digits
                  inputMode={'numeric'}
                />
              ),
              label: 'Padrón',
              readError: e => e.file as string,
            },
          ]}
        />
      </Flex>
    );
  };

  return (
    <Flex
      width={'100vw'}
      height={'100vh'}
      direction={'column'}
      align={'center'}
      justify={'center'}
    >
      <Image src={logo} width={'10vw'} />
      <Heading as="h1" marginTop={'3vh'} marginBottom={'3vh'}>
        Bienvenido a Teachhub!
      </Heading>
      <Text fontSize={'2xl'} marginBottom={'5vh'}>
        Accede a través de tu cuenta de GitHub
      </Text>
      <Button onClick={handleGithubLogin} size={'lg'}>
        Ingresar
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Completa tus datos</ModalHeader>
          <ModalBody>
            <RegisterForm initialValues={{}} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default LoginPage;
