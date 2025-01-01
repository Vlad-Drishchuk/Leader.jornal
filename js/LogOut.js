document.getElementById('logoutButton').addEventListener('click', () => {
    // Видаляємо дані користувача з localStorage
    localStorage.removeItem('loggedInUserId');

    // Опціонально: Можете видалити й інші дані, якщо вони є
    // localStorage.clear(); // якщо потрібно видалити все

    // Перенаправляємо на сторінку входу
    window.location.href = 'login.html'; // Вкажіть вашу сторінку входу
});