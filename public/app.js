const toCurrency = price => {
    return new Intl.NumberFormat('en-En', {
        currency: 'eur',
        style: 'currency'
    }).format(price);
}

const toDate = date => {
    return new Intl.DateTimeFormat('en-En', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

const $cart = document.querySelector('#cart');

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});

if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;

            fetch('/cart/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            })
            .then(res => res.json())
            .then(cart => {
                if (cart.courses.length) {
                    const html = cart.courses.map(course => {
                        return `
                        <tr>
                            <td>${course.title}</td>
                            <td>${course.count}</td>
                            <td>
                                <button class="btn btn-small js-remove" data-id="${course.id}">Delete</button>
                            </td>
                        </tr>
                        `
                    }).join('');

                    $cart.querySelector('tbody').innerHTML = html;
                    $cart.querySelector('.price').textContent = toCurrency(cart.price);
                } else {
                    $cart.innerHTML = '<p>Cart is empty</p>'
                }
            });
        }
    })
}

M.Tabs.init(document.querySelectorAll('.tabs'));
