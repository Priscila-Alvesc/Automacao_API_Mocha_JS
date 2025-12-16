const users = ['julio', 'priscila'];

export function getRandomUser() {
  return users[Math.floor(Math.random() * users.length)];
}