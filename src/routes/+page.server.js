import { db } from '$lib/firebase';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	Timestamp,
	updateDoc
} from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	async function getData() {
		try {
			const res = await getDocs(collection(db, 'guest'));
			const data = res.docs.map((doc) => {
				const docData = doc.data();
				return {
					id: doc.id,
					nim: docData.nim,
					name: docData.name,
					status: docData.status,
					date: docData.date.toDate().toISOString()
				};
			});

			return data;
		} catch (e) {
			console.error('Server Error', e);
			return []; // Always return an array, even on error
		}
	}

	/**
	 * @param {string} id
	 */
	async function getDataById(id) {
		try {
			const docRef = doc(db, 'guest', id);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const docData = docSnap.data();
				return {
					id: docSnap.id,
					nim: docData.nim,
					name: docData.name,
					status: docData.status,
					date: docData.date.toDate().toISOString()
				};
			} else {
				console.error('No such document!');
				return null;
			}
		} catch (e) {
			console.error('Server Error', e);
			return null;
		}
	}

	const id = url.searchParams.get('id') || '';

	return { guests: await getData(), guestById: id ? await getDataById(id) : null };
}

/** @type {import('./$types').Actions} */
export const actions = {
	tambah: async ({ request }) => {
		try {
			const formData = Object.fromEntries(await request.formData());
			const { name, nim } = formData;
			const status = formData.status ? 'hadir' : 'tidak hadir';

			await addDoc(collection(db, 'guest'), {
				nim: nim,
				name: name,
				status: status,
				date: Timestamp.now()
			});

			return {
				success: true,
				message: 'Data tamu berhasil ditambahkan!'
			};
		} catch (error) {
			console.error('Error adding document: ', error);
			return {
				success: false,
				message: 'Terjadi kesalahan saat menambahkan data tamu.'
			};
		}
	},

	ubah: async ({ request, url }) => {
		try {
			const id = url.searchParams.get('id');
			if (!id) {
				return {
					success: false,
					message: 'ID tidak ditemukan, tidak dapat mengubah data.'
				};
			}

			const formData = Object.fromEntries(await request.formData());
			const { name, nim } = formData;
			const status = formData.status ? 'hadir' : 'tidak hadir';

			const docRef = doc(db, 'guest', id);
			await updateDoc(docRef, {
				nim: nim,
				name: name,
				status: status,
				date: Timestamp.now()
			});

			return {
				success: true,
				message: 'Data tamu berhasil diubah!'
			};
		} catch (error) {
			console.error('Error updating document: ', error);
			return {
				success: false,
				message: 'Terjadi kesalahan saat mengubah data tamu.'
			};
		}
	},

	hapus: async ({ url }) => {
		try {
			const id = url.searchParams.get('id');
			if (!id) {
				return {
					success: false,
					message: 'ID tidak ditemukan, tidak dapat menghapus data.'
				};
			}

			await deleteDoc(doc(db, 'guest', id));

			return {
				success: true,
				message: 'Data berhasil dihapus!'
			};
		} catch (error) {
			console.error('Error deleting document: ', error);
			return {
				success: false,
				message: 'Terjadi kesalahan saat menghapus data.'
			};
		}
	}
};
