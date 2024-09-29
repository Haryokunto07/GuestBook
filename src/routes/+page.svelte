<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { onMount } from 'svelte';

	export let data;
	let search = '';
	$: message = '';

	/**
	 * @param {string | number | Date} isoString
	 */
	function formatDate(isoString) {
		const date = new Date(isoString);
		return (
			date.toLocaleDateString('id-ID', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}) +
			' ' +
			date.toLocaleTimeString('id-ID')
		);
	}

	$: ({ guests } = data);
	$: ({ guestById } = data);

	/**
	 * @type {null}
	 */
	$: selectedId = null;

	/**
	 * @param {any} id
	 */
	function openDeleteModal(id) {
		selectedId = id;
		const modal = document.getElementById('modal-hapus');
		// @ts-ignore
		modal.showModal(); // Membuka modal secara langsung
	}

	/**
	 * @param {string | null} id
	 */
	// @ts-ignore
	function openEditModal(id) {
		// @ts-ignore
		selectedId = id;

		goto(`?id=${selectedId}`);

		const modal = document.getElementById('modal-ubah');
		// @ts-ignore
		modal.showModal();
	}

	function openInfoModal() {
		const modal = document.getElementById('modal-info');
		// @ts-ignore
		modal.showModal();
	}

	/**
	 * @type {{ querySelector: (arg0: string) => any; } | null}
	 */
	$: visibleModal = null;

	/**
	 * @param {{ currentTarget: any; preventDefault?: any; }} event
	 */
	function toggleModal(event) {
		event.preventDefault();
		const modal = document.getElementById(event.currentTarget.dataset.target);
		if (!modal) return;
		// @ts-ignore
		modal.open ? closeModal(modal) : openModal(modal);
	}

	/**
	 * @param {{ querySelector: (arg0: string) => any; } | null} modal
	 */
	function openModal(modal) {
		const { documentElement: html } = document;
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		if (scrollbarWidth) {
			html.style.setProperty('--pico-scrollbar-width', `${scrollbarWidth}px`);
		}
		html.classList.add('modal-is-open', 'modal-is-opening');
		setTimeout(() => {
			visibleModal = modal; // Update visibleModal dengan modal yang dibuka
			html.classList.remove('modal-is-opening');
		}, 400);
		// @ts-ignore
		modal.showModal();
	}

	/**
	 * @param {{ querySelector: (arg0: string) => any; } | null} modal
	 */
	function closeModal(modal) {
		// @ts-ignore
		visibleModal = null;
		const { documentElement: html } = document;
		html.classList.add('modal-is-closing');
		setTimeout(() => {
			html.classList.remove('modal-is-closing', 'modal-is-open');
			html.style.removeProperty('--pico-scrollbar-width');
			// @ts-ignore
			modal.close();
		}, 400);
	}

	const handleSubmit = () => {
		// @ts-ignore
		return async ({ result, update }) => {
			switch (result.type) {
				case 'success':
					closeModal(document.getElementById('modal-tambah'));
					closeModal(document.getElementById('modal-hapus'));
					closeModal(document.getElementById('modal-ubah'));
					message = result.data.message;
					await goto('/');
					openInfoModal();
					break;
				case 'failure':
					// Handle failure case if needed
					break;
				default:
					break;
			}
			await update();
		};
	};

	let currentPage = 1;
	const itemsPerPage = 5;

	$: filteredData = guests.filter(
		(guest) =>
			guest.nim.toLowerCase().includes(search.toLowerCase()) ||
			guest.name.toLowerCase().includes(search.toLowerCase())
	);
	$: totalPages = Math.ceil(filteredData.length / itemsPerPage);
	$: paginatedData = filteredData.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	/**
	 * @param {number} page
	 */
	function handlePageChange(page) {
		currentPage = page;
	}

	onMount(() => {
		document.addEventListener('click', (event) => {
			if (visibleModal === null) return;
			const modalContent = visibleModal.querySelector('#modall');
			const isClickInside = modalContent.contains(event.target);
			// @ts-ignore
			if (!isClickInside) closeModal(visibleModal);
		});

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && visibleModal) {
				// @ts-ignore
				closeModal(visibleModal);
			}
		});
	});
</script>

<section class="grid margin-top-bottom">
	<article>
		<header class="header">
			<input type="search" bind:value={search} class="search-input" />
			<button data-target="modal-tambah" class="primary add-button" on:click={toggleModal}
				>Tambah Data Tamu</button
			>
		</header>
		<div class="overflow-auto">
			<table class="striped">
				<thead>
					<tr>
						<th>#</th>
						<th>Nim</th>
						<th>Nama</th>
						<th>Status</th>
						<th>Tanggal dan Waktu</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedData as guest, i}
						<tr>
							<td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
							<td>{guest.nim}</td>
							<td>{guest.name}</td>
							<td>{guest.status}</td>
							<td>{formatDate(guest.date)}</td>
							<td>
								<button type="button" class="primary" on:click={() => openEditModal(guest.id)}
									>Ubah</button
								>
								<button type="button" class="secondary" on:click={() => openDeleteModal(guest.id)}
									>Hapus</button
								>
							</td>
						</tr>
					{:else}
						<td colspan="6">Tidak ada data tamu</td>
					{/each}
				</tbody>
			</table>
		</div>
		<footer>
			<Pagination {totalPages} {currentPage} onPageChange={handlePageChange} />
		</footer>
	</article>
</section>

<dialog id="modal-info">
	<article id="modall">
		<header>
			<h3>Info</h3>
		</header>
		<p>{message}</p>
	</article>
</dialog>

<!-- Modal Tambah Data -->
<dialog id="modal-tambah">
	<article id="modall">
		<form action="?/tambah" method="post" use:enhance={handleSubmit}>
			<header>
				<h3>Tambah Data Tamu</h3>
			</header>
			<input type="number" name="nim" id="nim" placeholder="NIM Tamu" required />
			<input type="text" name="name" id="name" placeholder="Nama Tamu" required />
			<label>
				<input type="checkbox" name="status" id="status" />
				Akan hadir
			</label>
			<footer>
				<button type="submit">Simpan</button>
			</footer>
		</form>
	</article>
</dialog>

<!-- Modal Konfirmasi Hapus -->
<dialog id="modal-hapus">
	<article id="modall">
		<form action="?/hapus&id={selectedId}" method="post" use:enhance={handleSubmit}>
			<header>
				<h3>Konfirmasi Penghapusan</h3>
			</header>
			<p>Apakah Anda yakin ingin menghapus data ini?</p>
			<footer>
				<button type="submit">Hapus</button>
			</footer>
		</form>
	</article>
</dialog>

<!-- Modal Ubah Data -->
<dialog id="modal-ubah">
	<article id="modall">
		<form action="?/ubah&id={selectedId}" method="post" use:enhance={handleSubmit}>
			<header>
				<h3>Ubah Data Tamu</h3>
			</header>
			<input
				type="number"
				name="nim"
				id="nim"
				placeholder="NIM Tamu"
				value={guestById?.nim}
				required
			/>
			<input
				type="text"
				name="name"
				id="name"
				placeholder="Nama Tamu"
				value={guestById?.name}
				required
			/>
			<label>
				<input
					type="checkbox"
					name="status"
					id="status"
					checked={guestById?.status ? true : false}
				/>
				Akan hadir
			</label>
			<footer>
				<button type="submit">Simpan</button>
			</footer>
		</form>
	</article>
</dialog>
