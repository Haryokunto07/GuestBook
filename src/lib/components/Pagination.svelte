<script>
	/**
	 * @type {number}
	 */
	export let totalPages;
	/**
	 * @type {number}
	 */
	export let currentPage;
	/**
	 * @type {(arg0: number) => void}
	 */
	export let onPageChange;

	function handlePrevious() {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	}

	function handleNext() {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	}
</script>

<div class="flex-end">
	<div class="flex">
		<button on:click={handlePrevious} disabled={currentPage === 1}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-chevron-double-left"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
				/>
				<path
					fill-rule="evenodd"
					d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
				/>
			</svg>
		</button>
		<span>Halaman {currentPage} dari {totalPages}</span>
		<button on:click={handleNext} disabled={currentPage === totalPages}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-chevron-double-right"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"
				/>
				<path
					fill-rule="evenodd"
					d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"
				/>
			</svg>
		</button>
	</div>
</div>

<style>
	.flex {
		display: flex;
		flex-direction: row;
		gap: 10px;
		align-items: center;
	}
</style>
