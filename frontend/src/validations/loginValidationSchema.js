import * as Yup from 'yup';

const LoginValidationSchema = Yup.object().shape({
    identifier: Yup.string()
        .required('Champ obligatoire!')
        .min(5, "Exigence d'un minimum de 5 caractères!")
        .test('is-email-or-username', "Email ou nom d'utilisateur invalide!", value => {
            const isValidEmail = /\S+@\S+\.\S+/.test(value);
            const isValidUsername = /^[a-zA-Z0-9]+$/.test(value);
            return isValidEmail || isValidUsername;
        }),
    password: Yup.string()
        .min(8, 'Minimum Character 8 Requirement')
        // eslint-disable-next-line
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+-=,.<>;:'"{}\[\]|\\`~?]*$/, "Exigence de lettre et de chiffre!")
        .required('Champ obligatoire!')
});

export { LoginValidationSchema }