import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import dbConfig from './firebase-applet-config.json';

const app = initializeApp(dbConfig);
const auth = getAuth(app);
const db = getFirestore(app, dbConfig.firestoreDatabaseId);

async function seed() {
    try {
        console.log("Seeding admin...");
        let adminUser;
        try {
            const result = await createUserWithEmailAndPassword(auth, 'admin@hmart.com', 'admin123');
            adminUser = result.user;
        } catch (e: any) {
            console.log("Admin might exist, logging in...", e.message);
            const result = await signInWithEmailAndPassword(auth, 'admin@hmart.com', 'admin123');
            adminUser = result.user;
        }

        await setDoc(doc(db, 'users', adminUser.uid), {
            id: adminUser.uid,
            name: 'Admin User',
            email: 'admin@hmart.com',
            role: 'admin',
        }, { merge: true });
        console.log("Admin seeded.");

        console.log("Seeding normal user...");
        let normalUser;
        try {
            const result = await createUserWithEmailAndPassword(auth, 'user@hmart.com', 'user123');
            normalUser = result.user;
        } catch (e: any) {
            console.log("User might exist, logging in...", e.message);
            const result = await signInWithEmailAndPassword(auth, 'user@hmart.com', 'user123');
            normalUser = result.user;
        }

        await setDoc(doc(db, 'users', normalUser.uid), {
            id: normalUser.uid,
            name: 'Test Customer',
            email: 'user@hmart.com',
            role: 'user',
        }, { merge: true });
        console.log("Normal user seeded.");

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seed();
