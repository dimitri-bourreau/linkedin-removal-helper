(async () => {
	const listClassName = 'scaffold-finite-scroll__content';
	const removeDropdownClassName = 'artdeco-dropdown__trigger--placement-bottom';
	const peopleNameClassName = 'mn-connection-card__name';
	const removeButtonClassName = 'mn-connection-card__dropdown-option-text';
	const modalClassName = 'artdeco-modal';
	const confirmRemoveButtonClassName = 'artdeco-modal__confirm-dialog-btn';
	const removeText = 'Supprimer la relation';

	const list = document.getElementsByClassName(listClassName)[0];
	const network = [...list.getElementsByTagName('li')];

	let stop = false;

	while (!stop) {
		const list = document.getElementsByClassName(listClassName)[0];
		const network = [...list.getElementsByTagName('li')];
		await iterateOverNetwork(network);
	}

	async function iterateOverNetwork(network) {
		return new Promise(async (resolve) => {
			for (const people of network) {
				const removeDropdown = people.getElementsByClassName(
					removeDropdownClassName,
				)[0];
				const name =
					people.getElementsByClassName(peopleNameClassName)[0].innerText;

				people.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
					inline: 'nearest',
				});
				people.style.backgroundColor = 'lightBlue';

				const isToBeRemoved = confirm(`Remove ${name}?`);

				if (!isToBeRemoved) {
					people.style.backgroundColor = 'green';
				} else {
					removeDropdown.click();
					people.style.backgroundColor = 'red';
					await remove(people);
				}
			}
			return resolve();
		});
	}

	async function remove(people) {
		return new Promise((resolve) => {
			setTimeout(async () => {
				const removeButton = people.getElementsByTagName('span')[6];
				if (removeButton.innerText === removeText) {
					removeButton.click();
					await confirmRemoval();
					return resolve();
				} else {
					for (const span of people.getElementsByTagName('span')) {
						if (removeButton.innerText === removeText) {
							removeButton.click();
							await confirmRemoval();
							return resolve();
						}
					}
				}
			}, 200);
		});
	}

	async function confirmRemoval() {
		return new Promise((resolve) => {
			setTimeout(() => {
				const modal = document.getElementsByClassName(modalClassName)[0];
				const confirmButton = modal.getElementsByClassName(
					confirmRemoveButtonClassName,
				)[1];
				confirmButton.click();
				return resolve();
			}, 200);
		});
	}
})();
