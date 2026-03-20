
export type UserType = 'FREE' | 'PREMIUM' | 'ADMIN';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  status: UserStatus;
  signupDate: string;
  lastAccess: string;
  routesAccessed: number;
  itinerariesCreated: number;
  memoriesRegistered: number;
}

// 2. Criamos o nosso array de dados (MOCK DATA)
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@example.com",
    type: "PREMIUM",
    status: "active",
    signupDate: "2023-11-10",
    lastAccess: "2024-11-15",
    routesAccessed: 45,
    itinerariesCreated: 12,
    memoriesRegistered: 28,
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@example.com",
    type: "FREE",
    status: "active",
    signupDate: "2024-03-22",
    lastAccess: "2024-11-13",
    routesAccessed: 12,
    itinerariesCreated: 0,
    memoriesRegistered: 5,
  },
  {
    id: "3",
    name: "Carlos Ferreira",
    email: "carlos.f@example.com",
    type: "FREE",
    status: "inactive",
    signupDate: "2024-01-05",
    lastAccess: "2024-06-20",
    routesAccessed: 3,
    itinerariesCreated: 1,
    memoriesRegistered: 0,
  },
  {
    id: "4",
    name: "Ana Pereira",
    email: "ana.pereira@example.com",
    type: "PREMIUM",
    status: "active",
    signupDate: "2024-08-14",
    lastAccess: "2024-11-16",
    routesAccessed: 8,
    itinerariesCreated: 2,
    memoriesRegistered: 10,
  },
  {
    id: "5",
    name: "Rui Costa",
    email: "rui.costa.banido@example.com",
    type: "FREE",
    status: "suspended",
    signupDate: "2024-10-01",
    lastAccess: "2024-10-15",
    routesAccessed: 50,
    itinerariesCreated: 0,
    memoriesRegistered: 0,
  }
];


export const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_USERS);
    }, 600);
  });
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_USERS.find(user => user.id === id));
    }, 400);
  });
};

export const deleteUser = async (id: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Utilizador ${id} apagado com sucesso na base de dados fictícia!`);
      resolve({ success: true });
    }, 800);
  });
};