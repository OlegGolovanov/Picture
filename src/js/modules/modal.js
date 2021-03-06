// import windowOptions from "./windowOptions";

const modal = () => {
    let avtoOpoenModal = true;
    // Верстка такова, что скрываем и показываем
    // фон модального окна (его подложку)    
    //-------------------1. Функции---------------------------------------//
    // 1.1. Скрытие, показ модального окна 
    function actionModal({
        /* кнопка, открываюая мод. окно */
        selectorButton,
        /* Подложка (фон) конкретного модального окна */
        selectorModal,
        /* Подложки (фон) всех модальных окон */
        // Чтобы закрывать все окна на случай вызова модального
        // окна через другое модальное окно, а не через верстку.
        // В обратном случае два открытых окна будут мешаться
        // друг другу.
        selectorModals,
        selectorModalContent,
        /* кнопка, скрывающая фон модального окна
        вместе с модальным окном */
        selectorClose,
        /* класс, присваивающий display: block; */
        styleShow,
        removeButton = false,
    }) {

        const button = document.querySelectorAll(selectorButton),
            modal = document.querySelector(selectorModal),
            modals = document.querySelectorAll(selectorModals),
            modalContent = document.querySelector(selectorModalContent),
            close = document.querySelectorAll(selectorClose);
        // Подключил функцию по наполнению объекта. Чтобы валидировать
        // соответствующие формы
        // let setWindowOptions = {};
        // windowOptions(setWindowOptions);

        // Показывает и скрывает конкретное модальное окно
        function closeModal() {
            modal.style.display = `none`;
            // Окно не прокручивается
            document.body.style.overflow = "";
            document.body.style.marginRight = `0px`;
        }
        // Показывает и скрывает все модальные окна
        // Для тех случаев, когда вызов модальных окон из 
        // другого модального окна
        function closeModalAll() {
            modals.forEach(item => {
                item.style.display = `none`;
            });
            document.body.style.overflow = "";
            document.body.style.marginRight = `0px`;
        }

        function showModal() {
            // Все окна закрываются
            closeModalAll();
            // Открывается только заданное модальное окно
            modal.style.display = `${styleShow}`;
            // Окно прокручивается
            document.body.style.overflow = "hidden";
            document.body.style.marginRight = `${showWidthScroll()}px`;
            avtoOpoenModal = false;

        }

        // Валидация на заполненность форм отдельных модальных
        // окон
        // function validationWindow() {
        //     if (modal.matches('.popup_calc_profile') &&
        //         setWindowOptions != {} &&
        //         setWindowOptions.width != '' &&
        //         setWindowOptions.height != '' &&
        //         setWindowOptions.form > 0) {
        //         return true;
        //     }

        //     if (modal.matches('.popup_calc_end') &&
        //         setWindowOptions != {} &&
        //         setWindowOptions.view_type != '' &&
        //         (setWindowOptions.cold == true ||
        //             setWindowOptions.warm == true)) {
        //         return true;
        //     }
        // }


        // Размер смещения старницы из-за бегунка прокрутки
        function showWidthScroll() {
            // 1. Создаем блок
            let div = document.createElement("div");
            document.body.append(div);
            // 2. Присваиваем стили, чтобы:
            // был
            div.style.width = "50px";
            div.style.height = "50px";
            // виден скролл
            div.style.overflowY = "scroll";
            // скрываем из верстки
            div.style.visibility = "hidden";
            // 3. Получаем ширину скрола
            let widthScroll = div.offsetWidth - div.clientWidth;
            // 4. удаляем элемент со страницы
            div.remove();
            // 5. В итоге в функции будет значение ширины бегунка прокрутки
            // странцы. Это значение подставляем в виде марджена, когда
            // появляется блок, чтобы странца не прыгала
            return widthScroll;
        }

        // function clearInputs(inputSelector) {
        //     const numInputs = document.querySelectorAll(inputSelector);
        //     numInputs.forEach(numInput => {
        //         numInput.value = "";
        //     });
        // }

        // function showMessageError() {
        //     let statusMessage = document.createElement('div');
        //     statusMessage.classList.add('status');
        //     statusMessage.textContent = "Выбраны не все параметры";
        //     modalContent.appendChild(statusMessage);
        //     setTimeout(function () {
        //         statusMessage.remove();
        //     }, 2000);
        // }

        // Событие все кнопоки
        button.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();

                if (removeButton) {
                    button.remove();
                }

                if (e.target) {
                    // Все окна закрываются
                    showModal();
                }
            });
        });

        // Клик на крестики - окно исчезает
        close.forEach(close => {
            close.addEventListener("click", (e) => {
                // Все окна закрываются
                closeModal();
                document.body.style.overflow = "";
            });
        });

        // Клик на подложку - окно исчезает
        modal.addEventListener("click", (e) => {
            // Если кликаем только на подложку,
            // а не на само модальное окно
            if (e.target === modal) {
                // Все окна закрываются
                closeModal();
                document.body.style.overflow = "";
            }
        });

        // Закрытие окна на клавишу 
        document.addEventListener('keydown', (e) => {
            if (e.code === "Escape" && window.getComputedStyle(modal).display == "block") {
                closeModal();
                document.body.style.overflow = "";
            }
        });

    }

    //1.2.Через время открываются не все, а конкретное окно

    function timerShowModal({
        selectorModal,
        time,
        styleShow,
    }) {
        setTimeout(function () {
            if (avtoOpoenModal) {
                document.querySelector(selectorModal).style.display = `${styleShow}`;
            }
        }, time);
    }

    function showModalscroll({
        selectorButton
    }) {
        window.addEventListener("scroll", () => {
            // 1. Если ранее не открывал окно. В обработчике открытия
            // окна поставил эту переменную со значением false
            if (avtoOpoenModal) {
                // 2. Для поддержки старых браузеров, берем любое из максимальных значений
                // Math.max всей высоты страницы (document.documentElement.scrollHeight или
                //     document.body.scrollHeight)
                let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                // 3. Если вся всота страницы scrollHeight меньше или равна прокрученной части .scrollTop + 
                // высоты текущего окна .clientHeigh
                if (scrollHeight <= document.documentElement.clientHeight + document.documentElement.scrollTop) {
                //    4.  Повторно передаю ранее присовенный клик .click(); к кнопке вызова окна. 
                // Т.е. если ранее присвоили клик, его еще раз можно вызвать
                    document.querySelector(selectorButton).click();
                }
            }
        });
    }



    //-------------------2. Вызовы функций---------------------------------------//


    // 2.1. Модальное окно заказать дизайн
    actionModal({
        /* кнопка, открываюая мод. окно */
        selectorButton: ".button-design",
        /* Подложка (фон) модального окна */
        selectorModal: '.popup-design',
        /* кнопка, закрывающая модальное окно */
        selectorClose: '.popup-close',
        /* класс (без точки), присваивающий display: block; */
        styleShow: 'block',
    });
    // 2.2. Модальное окно подробнее об услуге
    actionModal({
        /* кнопка, открываюая мод. окно */
        selectorButton: ".button-consultation",
        /* Подложка (фон) модального окна */
        selectorModal: '.popup-consultation',
        /* кнопка, закрывающая модальное окно */
        selectorClose: '.popup-close',
        /* класс (без точки), присваивающий display: block; */
        styleShow: 'block',
    });

    // 2.3. Модальное окно с подарком
    actionModal({
        /* кнопка, открываюая мод. окно */
        selectorButton: ".fixed-gift",
        /* Подложка (фон) модального окна */
        selectorModal: '.popup-gift',
        /* кнопка, закрывающая модальное окно */
        selectorClose: '.popup-close',
        /* класс (без точки), присваивающий display: block; */
        styleShow: 'block',
        removeButton: true
    });

    // 2.4 Таймер показа модального окна
    // timerShowModal({
    //     selectorModal: ".popup-consultation",
    //     time: 2000,
    //     styleShow: 'block'
    // });

    // 2.5. При листании страницы до конца модальное окано

    showModalscroll({
        selectorButton: '.fixed-gift',
    });
};

export default modal;