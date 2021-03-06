// Не обязательный блок. Обрезаем имя загружаемого файла.
import "../modules/nameTrim";
import calculator from "../modules/calculator";


function postForms() {
    const message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };
    
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        // 1. На каждую форму вешаем обработчик события.
        // с событием submit
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            // НЕ ОБЯЗАТЕЛЬНЫЙ БЛОК
            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            form.appendChild(statusMessage);
            // 1.1. Информация, введенная форму, собирается
            // в специальном объекте new FormData(form)
            const formData = new FormData(form);
            // Адресс сервера в зависимости от вида изображения
                       
            let path;
            if (form.closest(".popup-design") || form.closest(".calc")) {
                path = "assets/picture.php";
            } else {
                path = "assets/server.php";
            }
            // Здесь объект, записанный в 
            // calculator
            let obj = calculator();

            for (let key in obj) {
                formData.append(key, obj[key]);
            }

            post("assets/server.php", formData)
            .then(data => {
                console.log(data);
            });

            // 1.2. Отправляем данные на сервер. Выполняется функция
            // post, тело которой описано в пункте п. 1.3  
            post(path, formData)
                // 1.4.  Можем проверить, ушли ли инф. на сервер.
                // Через Promise
                // При положительном варианте событий при повторном
                // обращении к .then можем выполнять действия
                .then(data => {
                    console.log(data);
                    statusMessage.textContent = message.success;
                })
                .catch(() => {
                    statusMessage.textContent = message.failure;
                })
                .finally(() => {
                    form.reset();
                    setTimeout(function () {
                        statusMessage.remove();
                        document.querySelectorAll('[data-modal]').forEach(modal => {
                            modal.classList.add("animate__animated", "animate__bounceOut")
                            setTimeout(function () {
                                modal.classList.remove("animate__animated", "animate__bounceOut")
                                modal.style.display = "none";
                            }, 1000);
                        });
                        document.body.style.overflow = "";
                    }, 2000);
                });
        });
    });

    // 1.3. Настраиваем механизм отправки данных на сервер
    // async - чтобы функция выполнилась после получения данных
    // с сервера.
    // Вместо url в пункте 1.2. подставится адрес
    // Вместо request в пункте 1.2. подставится то, что
    // будем отправлять на сервер - new FormData(form)
    const post = async function (url, request) {
        let res = await fetch(url, {
            method: "POST",
            // отправляем информацию на сервер
            body: request
        });
        // Возвращаем полученный ответ от сервера о том, что
        // информация отправлена .then или нет .catch
        return await res.text();
    };
}

export default postForms;