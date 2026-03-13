const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'delivery-manager';

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // coleções possíveis
    const possibleCollections = ['user_entity', 'user'];

    let usersCollection = null;

    for (const name of possibleCollections) {
      const exists = await db.listCollections({ name }).toArray();
      if (exists.length) {
        usersCollection = db.collection(name);
        break;
      }
    }

    if (!usersCollection) {
      usersCollection = db.collection('user_entity');
      console.log('Coleção não encontrada. Usando: user_entity');
    }

    const username = 'admin';
    const existing = await usersCollection.findOne({ user: username });

    if (existing) {
      console.log('Já existe um usuário admin com user = admin');
      return;
    }

    const passwordHash = await bcrypt.hash('123456', 10);

    const now = new Date();

    const newAdmin = {
      id: randomUUID(),
      name: 'Administrador',
      phone: '99999999999',
      user: 'admin',
      password: passwordHash,
      pix: 'admin@pix.com',
      profileImage: '',
      location: '',
      type: 'admin',
      permission: 'master',
      isActive: true,
      notification: {
        subscriptionId: '',
      },
      token: '',
      createdAt: now,
      createdBy: 'script',
      updatedAt: now,
    };

    const result = await usersCollection.insertOne(newAdmin);

    console.log('Admin criado com sucesso!');
    console.log('ID:', result.insertedId);
    console.log('Login: admin');
    console.log('Senha: 123456');
  } catch (error) {
    console.error('Erro ao criar admin:', error);
  } finally {
    await client.close();
  }
}

main();