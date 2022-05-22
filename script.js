(async function linkedInRemovalHelper() {
	/**
	 * ---------------------------------
	 * CONFIG
	 * ---------------------------------
	 * awaitTime:
	 * 	Time in ms to wait for LinkedIn to display a button to remove a connection.
	 * 	Used twice.
	 * 	LinkedIn can get pretty slow!
	 * 	If you regularly have a failure due to an out of reach button: increase awaitTime. 👍
	 */
	const awaitTime = 200;

	const listClassName = 'scaffold-finite-scroll__content';
	const removeDropdownClassName = 'artdeco-dropdown__trigger--placement-bottom';
	const peopleNameClassName = 'mn-connection-card__name';
	const modalClassName = 'artdeco-modal';
	const confirmRemoveButtonClassName = 'artdeco-modal__confirm-dialog-btn';
	const removeText = 'Supprimer la relation';

	const ERR_CAN_T_FIND_REMOVE_BUTTON = 'ERR_CAN_T_FIND_REMOVE_BUTTON';
	const ERR_NO_MODAL = 'ERR_NO_MODAL';

	/**
	 * ---------------------------------
	 * MAIN PROGRAM
	 * ---------------------------------
	 */
	let newConnectionsToRemove = true;
	while (newConnectionsToRemove) {
		const connections = getDisplayedConnections(document);
		if (!connections) return newConnectionsToRemove = false;
		const sortedConnections  = removeFromListKeptConnections(connections);
		try {
			await iterateOverNetwork(sortedConnections);
		} catch(error) {
			newConnectionsToRemove = false;
			return handleError(error);
		}
	}

	/**
	 * ---------------------------------
	 * MAIN FUNCTIONS
	 * ---------------------------------
	 */
	async function iterateOverNetwork(connections) {
		return new Promise(async (resolve, reject) => {
				for (const connection of connections) {
					scrollTo(connection);
					makeConnectionBlue(connection);
					const isToBeRemoved = askToRemove(connection);
					if (isToBeRemoved) {
						try {
							await remove(connection);
						} catch(error) {
							return reject(error);
						}
					} else {
						keep(connection);
					}
				}
				return resolve();
		});
	}

	async function remove(connection) {
		return new Promise((resolve, reject) => {
				openRemoveDropdown(connection);
				makeConnectionRed(connection);
				setTimeout(async () => {
					try {
						await confirmRemoval(connection);
					} catch(error) {
						return reject(error);
					}
					return resolve();
				}, awaitTime);
		});
	}

	async function confirmRemoval(connection) {
		return new Promise((resolve, reject) => {
			try {
				clickRemoveButton(connection);
			} catch(error) {
				return reject(error);
			}
			setTimeout(() => {
				try {
					clickConfirmRemoval(document)
				} catch(error) {
					return reject(error);
				}
				return resolve();
			}, awaitTime);
		});
	}

	function keep(connection) {
		return makeConnectionGreen(connection);
	}

	function removeFromListKeptConnections(connections) {
		return [...connections].filter(connection => connection.style.backgroundColor !== 'green')
	}

	function handleError(error) {
		let refreshAuthorization = false;
		switch(error) {
			case ERR_CAN_T_FIND_REMOVE_BUTTON:
				refreshAuthorization = confirm('Impossible de trouver automatiquement le bouton supprimer, cliquez sur OK pour rafraîchir la page et réessayer. 😊');
				if (refreshAuthorization) window.location.reload();
				break;
			case ERR_NO_MODAL:
				refreshAuthorization = confirm('Impossible de trouver automatiquement le modal pour supprimer, cliquez sur OK pour rafraîchir la page et réessayer. 😊');
				if (refreshAuthorization) window.location.reload();
				break;
			default:
				refreshAuthorization = confirm('Une erreur non gérée automatiquement est survenue, désolé. Cliquez sur OK pour rafraîchir la page et réessayer !')
				if (refreshAuthorization) window.location.reload();
		}
	}

	/**
	 * ---------------------------------
	 * HELPERS
	 * ---------------------------------
	 */
	function getListOfConnections(document) {
		return document.getElementsByClassName(listClassName)[0];
	}
	function getConnectionsFromList(list) {
		return [...list.getElementsByTagName('li')];
	}
	function getNameFromConnection(connection) {
		return connection.getElementsByClassName(peopleNameClassName)[0].innerText;
	}
	function getRemoveDropdown(connection) {
		return connection.getElementsByClassName(
			removeDropdownClassName,
		)[0];
	}
	function scrollTo(connection) {
		return connection.scrollIntoView?.({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest',
		});
	}
	function makeConnectionBlue(connection) {
		return connection.style.backgroundColor = 'lightBlue';
	}
	function makeConnectionGreen(connection) {
		return connection.style.backgroundColor = 'green';
	}
	function makeConnectionRed(connection) {
		return connection.style.backgroundColor = 'red';
	}
	function askToRemove(connection) {
		const name = getNameFromConnection(connection);
		return confirm(`Remove ${name}?`);
	}
	function openRemoveDropdown(connection) {
		const removeDropdown = getRemoveDropdown(connection);
		return removeDropdown.click();
	}
	function getRemoveButton(connection) {
		const spans = connection.getElementsByTagName('span');
		for (const span of spans) {
			if (span?.textContent === removeText) {
				return span;
			}
		}
		throw(ERR_CAN_T_FIND_REMOVE_BUTTON);
	}
	function getRemoveConfirmModal(document) {
		const modal = document.getElementsByClassName(modalClassName)[0];
		if (!modal) throw(ERR_NO_MODAL);
		return modal;
	}
	function clickConfirmRemoval(document) {
		const modal = getRemoveConfirmModal(document);
		const confirmButton = modal.getElementsByClassName(
			confirmRemoveButtonClassName,
		)[1];
		confirmButton.click();
	}
	function clickRemoveButton(connection) {
		const removeButton = getRemoveButton(connection)
		return removeButton.click();
	}
	function getDisplayedConnections(document) {
		const listOfConnections = getListOfConnections(document);
		return getConnectionsFromList(listOfConnections);
	}
})();

/**
 * ---------------------------------
 * VOCABULARY
 * ---------------------------------
 * - Connection: a user we are connected to, like a Facebook friend
 */
