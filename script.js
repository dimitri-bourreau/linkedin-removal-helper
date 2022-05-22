(async function linkedInRemovalHelper() {
	/**
	 * ---------------------------------
	 * CONFIG
	 * ---------------------------------
	 * awaitTime:
	 * 	 Temps en ms à attendre que LinkedIn affiche les boutons pour supprimer une relation.
	 * 	 Utilisé deux fois.
	 * 	 Parfois LinkedIn est lent, aussi j'imagine que ça varie suivant votre machine.
	 * 	 Si vous rencontrez plusieurs fois une erreur indiquant ne pas trouver de bouton pour supprimer,
	 * 	 pensez à indiquer un temps plus long (1000ms = 1s). 👍
	 * scrollView:
	 *   Définit où apparaît l'utilisateur à supprimer sur votre écran.
	 *   'start': en haut de l'écran (non recommandé, LinkedIn le cachant).
	 *   'center': au centre.
	 *   'end': en bas.
	 */
	const awaitTime = 400;
	const scrollView = 'center';

	const listClassName = 'scaffold-finite-scroll__content';
	const removeDropdownClassName = 'artdeco-dropdown__trigger--placement-bottom';
	const peopleNameClassName = 'mn-connection-card__name';
	const modalClassName = 'artdeco-modal';
	const confirmRemoveButtonClassName = 'artdeco-modal__confirm-dialog-btn';
	const removeText = 'Supprimer la relation';

	const ERR_CAN_T_FIND_REMOVE_BUTTON = 'ERR_CAN_T_FIND_REMOVE_BUTTON';
	const ERR_NO_MODAL = 'ERR_NO_MODAL';
	const ERR_NO_DROPDOWN = 'ERR_NO_DROPDOWN';

	const MSG_ERR_INTRODUCTION = `
		------------\n
		⚠️ ERREUR ⚠️\n
		------------\n
	`;
	const MSG_ERR_OUTRO = `
		------------\n
		Merci de copier-coller\n
		à nouveau le script. ✌️\n
		------------\n
	`;
	const MSG_ERR_CAN_T_FIND_REMOVE_BUTTON = `
		Impossible de trouver\n
		automatiquement le\n
		bouton supprimer.\n\n
	`;
	const MSG_ERR_NO_MODAL = `
		Impossible de trouver\n
		automatiquement le\n
		modal pour supprimer\n
		la relation.\n\n
	`;
	const MSG_ERR_NO_DROPDOWN = `
		Impossible de trouver\n
		automatiquement le\n
		menu déroulant pour\n
		supprimer la relation.\n\n
	`;
	const MSG_ERR_UNKNOWN = `
		Une erreur non gérée\n
		automatiquement est\n
		survenue, désolé.\n\n
	`;

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
		if (!sortedConnections.length === 0) return newConnectionsToRemove = false;
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
				try {
					openRemoveDropdown(connection);
				} catch(error) {
					return reject(error);
				}
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
		return [...connections]
			.filter(connection => connection.style.backgroundColor !== 'green' && connection.style.backgroundColor !== 'red')
	}

	function handleError(error) {
		switch(error) {
			case ERR_CAN_T_FIND_REMOVE_BUTTON:
				alert(`${MSG_ERR_INTRODUCTION}${MSG_ERR_CAN_T_FIND_REMOVE_BUTTON}${MSG_ERR_OUTRO}`);
				break;
			case ERR_NO_MODAL:
				alert(`${MSG_ERR_INTRODUCTION}${MSG_ERR_NO_MODAL}${MSG_ERR_OUTRO}`);
				break;
			case ERR_NO_DROPDOWN:
				alert(`${MSG_ERR_INTRODUCTION}${MSG_ERR_NO_DROPDOWN}${MSG_ERR_OUTRO}`);
				break;
			default:
				alert(`${MSG_ERR_INTRODUCTION}${MSG_ERR_NO_MODAL}${MSG_ERR_OUTRO}`)
		}
	}

	/**
	 * ---------------------------------
	 * HELPERS
	 * ---------------------------------
	 */
	function getListOfConnections(document) {
		const list = document.getElementsByClassName(listClassName);
		return list ? list[0] : undefined;
	}
	function getConnectionsFromList(list) {
		return [...list.getElementsByTagName('li')];
	}
	function getNameFromConnection(connection) {
		const nameElt = [...connection.getElementsByClassName(peopleNameClassName)];
		return nameElt[0]?.textContent.trim() || undefined;
	}
	function getRemoveDropdown(connection) {
		const dropdown = connection.getElementsByClassName(removeDropdownClassName);
		return dropdown ? dropdown[0] : undefined;
	}
	function scrollTo(connection) {
		return connection.scrollIntoView?.({
			behavior: 'smooth',
			block: scrollView,
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
		return !name ? null : confirm(`Supprimer votre relation avec ${name} ?`);
	}
	function openRemoveDropdown(connection) {
		const removeDropdown = getRemoveDropdown(connection);
		if (!removeDropdown) throw ERR_NO_DROPDOWN;
		return removeDropdown.click();
	}
	function getRemoveButton(connection) {
		const spans = connection.getElementsByTagName('span');
		for (const span of spans) {
			if (span?.textContent === removeText) {
				return span;
			}
		}
		console.error(ERR_CAN_T_FIND_REMOVE_BUTTON, connection);
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
		return listOfConnections ? getConnectionsFromList(listOfConnections) : undefined;
	}
})();

/**
 * ---------------------------------
 * VOCABULARY
 * ---------------------------------
 * - Connection: a user we are connected to, like a Facebook friend
 */
