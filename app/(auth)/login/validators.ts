import {FormEvent} from "react";


export function EmailValidator(e: FormEvent<HTMLInputElement>) {
    if (!e.currentTarget.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        e.currentTarget.setCustomValidity("Неккоректный адрес электронной почты");
        return;
    }
    e.currentTarget.setCustomValidity("");
}

export function PasswordValidator(e: FormEvent<HTMLInputElement>) {
    const password = e.currentTarget.value;
    const match = password.match(/^[a-zA-Z0-9а-яА-Я.&?$%*@#]+$/);
    if (!match) {
        const invertMatch = password.match(/[^a-zA-Z0-9а-яА-Я.&?$%*@#]/);
        if (invertMatch)
            e.currentTarget.setCustomValidity("Пароль содержит недопустимый символ \"" + invertMatch[0] + "\", разрешены только латинские и русские буквы, цифры, спец.символы: . & ? $ % * @ #");
        return;
    }
    e.currentTarget.setCustomValidity("");
}

export function NameValidator(e: FormEvent<HTMLInputElement>) {
    const name = e.currentTarget.value;
    const match = name.match(/^[a-zA-Zа-яА-Я]+$/);
    if (name.length > 0 && !match) {
        e.currentTarget.setCustomValidity("Поле содержит недопустимые символы (пробелы, цифры и любые спец.символы запрещены)");
        return;
    }
    e.currentTarget.setCustomValidity("");
}

export function PhoneValidator(e: FormEvent<HTMLInputElement>) {
    const phone = e.currentTarget.value;
    const match = phone.match(/^7?[0-9]{10}$/);
    if (phone.length > 0 && !match) {
        if (phone.length != 11)
            e.currentTarget.setCustomValidity("Введите номер в формате 7XXXXXXXXXX");
        else
            e.currentTarget.setCustomValidity("Номер содержит неккоректные символы, разрешены только цифры");
        return;
    }
    e.currentTarget.setCustomValidity("");
}