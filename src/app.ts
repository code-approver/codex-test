interface User {
  username: string;
  password: string;
}

interface Order {
  user: string;
  pizza: string;
}

const USERS_KEY = 'users';
const SESSION_KEY = 'session';
const ORDERS_KEY = 'orders';

const loginDiv = document.getElementById('login') as HTMLDivElement;

const registerDiv = document.getElementById('register') as HTMLDivElement;
const appDiv = document.getElementById('order') as HTMLDivElement;

const usernameInput = document.getElementById('username') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;
const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
const showRegisterButton = document.getElementById('showRegister') as HTMLButtonElement;
const newUsernameInput = document.getElementById('newUsername') as HTMLInputElement;
const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
const registerButton = document.getElementById('registerButton') as HTMLButtonElement;
const cancelRegisterButton = document.getElementById('cancelRegister') as HTMLButtonElement;
const pizzaSelect = document.getElementById('pizzaSelect') as HTMLSelectElement;
const orderButton = document.getElementById('orderButton') as HTMLButtonElement;
const ordersList = document.getElementById('orders') as HTMLUListElement;
const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function register(username: string, password: string): void {
  const users = getUsers();
  if (!users.find(u => u.username === username)) {
    users.push({ username, password });
    saveUsers(users);
  }
  localStorage.setItem(SESSION_KEY, username);
  showApp();
}

function login(username: string, password: string): void {
  const user = getUsers().find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem(SESSION_KEY, username);
    showApp();
  } else {
    alert('Invalid credentials');
  }
}

function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  showLogin();
}

function getCurrentUser(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function addOrder(pizza: string): void {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') as Order[];
  orders.push({ user: currentUser, pizza });
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  renderOrders();
}

function renderOrders(): void {
  const currentUser = getCurrentUser();
  const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') as Order[];
  ordersList.innerHTML = '';
  orders.filter(o => o.user === currentUser).forEach(o => {
    const li = document.createElement('li');
    li.textContent = o.pizza;
    ordersList.appendChild(li);
  });
}

function showApp(): void {
  loginDiv.style.display = 'none';
  registerDiv.style.display = 'none';

  appDiv.style.display = 'block';
  renderOrders();
}

function showLogin(): void {
  loginDiv.style.display = 'block';
  registerDiv.style.display = 'none';
  appDiv.style.display = 'none';
}

function showRegister(): void {
  loginDiv.style.display = 'none';
  registerDiv.style.display = 'block';

  appDiv.style.display = 'none';
}

loginButton.addEventListener('click', () => login(usernameInput.value, passwordInput.value));

showRegisterButton.addEventListener('click', () => showRegister());
registerButton.addEventListener('click', () => register(newUsernameInput.value, newPasswordInput.value));
cancelRegisterButton.addEventListener('click', () => showLogin());

orderButton.addEventListener('click', () => addOrder(pizzaSelect.value));
logoutButton.addEventListener('click', () => logout());

if (getCurrentUser()) {
  showApp();
} else {
  showLogin();
}

