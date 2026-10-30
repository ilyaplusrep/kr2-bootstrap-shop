const orderModal = document.getElementById('orderModal');
const orderForm = document.getElementById('order-form');
const successToast = document.getElementById('success-toast');
const successAlert = document.getElementById('order-success');

// модальное окно — только если оно есть на странице.
// Открывает его сам Bootstrap (data-bs-toggle="modal"), мы лишь подставляем название товара.
if (orderModal) {
  // show.bs.modal — событие Bootstrap перед открытием; relatedTarget — кнопка, по которой кликнули
  orderModal.addEventListener('show.bs.modal', (event) => {
    const product = event.relatedTarget?.dataset.product ?? '';
    document.getElementById('selected-product').value = product;
    document.getElementById('order-product-name').textContent = product;
  });
}

// форма — только если она есть на странице
if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // was-validated — класс Bootstrap: подсвечивает поля красным/зелёным и показывает .invalid-feedback
    if (!orderForm.checkValidity()) {
      orderForm.classList.add('was-validated');
      return;
    }

    orderForm.reset();
    orderForm.classList.remove('was-validated');

    // главная: закрыть модалку и показать toast
    if (orderModal) {
      bootstrap.Modal.getInstance(orderModal)?.hide();
    }
    if (successToast) {
      bootstrap.Toast.getOrCreateInstance(successToast).show();
    }

    // страница заявки: показать alert и прокрутить к нему
    if (successAlert) {
      successAlert.classList.remove('d-none');
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// крестик у alert прячет его (а не удаляет, как data-bs-dismiss) — чтобы показать снова после следующей заявки
if (successAlert) {
  successAlert.querySelector('.btn-close').addEventListener('click', () => {
    successAlert.classList.add('d-none');
  });
}

// фильтры каталога — только на странице каталога
const filtersForm = document.getElementById('filters-form');

if (filtersForm) {
  const products = document.querySelectorAll('[data-category]');
  const productsCount = document.getElementById('products-count');
  const productsEmpty = document.getElementById('products-empty');

  const applyFilters = () => {
    // какие категории отмечены: ['gift', 'premium', ...]
    const checkedCategories = Array.from(filtersForm.querySelectorAll('[name="category"]:checked'))
      .map((input) => input.value);
    const onlyInStock = filtersForm.querySelector('[name="stock"]').checked;

    let visibleCount = 0;

    products.forEach((product) => {
      const productCategories = product.dataset.category.split(' ');
      // ничего не отмечено — подходят все; иначе нужна хотя бы одна общая категория
      const categoryOk = checkedCategories.length === 0
        || checkedCategories.some((category) => productCategories.includes(category));
      const stockOk = !onlyInStock || product.dataset.stock === 'yes';
      const isVisible = categoryOk && stockOk;

      // d-none — утилита Bootstrap (display: none): прячем неподходящие карточки
      product.classList.toggle('d-none', !isVisible);
      if (isVisible) {
        visibleCount += 1;
      }
    });

    productsCount.textContent = visibleCount;
    productsEmpty.classList.toggle('d-none', visibleCount > 0);
  };

  filtersForm.addEventListener('change', applyFilters);
  // событие reset приходит ДО очистки галочек, поэтому пересчитываем на следующем шаге
  filtersForm.addEventListener('reset', () => setTimeout(applyFilters));
}
