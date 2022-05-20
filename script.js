const listClassName = 'scaffold-finite-scroll__content';
const removeDropdownClassName = 'artdeco-dropdown__trigger--placement-bottom';
const peopleNameClassName = 'mn-connection-card__name';
const modalClassName = 'artdeco-modal';
const confirmRemoveButtonClassName = 'artdeco-modal__confirm-dialog-btn';
const removeText = 'Supprimer la relation';
const awaitTime = 200;

(async function linkedInRemovalHelper() {
	let stop = false;
	while (!stop) {
		const listOfConnections = getListOfConnections(document);
		const connections = getConnectionsFromList(listOfConnections);
		if (connections.length > 0) {
			const sortedConnections  = removeFromListKeptConnections(connections);
			await iterateOverNetwork(sortedConnections);
		} else {
			stop = true;
		}
	}
})();

/**
 * ---------------------------------
 * MAIN FUNCTIONS
 * ---------------------------------
 */
async function iterateOverNetwork(connections) {
	return new Promise(async (resolve) => {
		for (const connection of connections) {
			scrollTo(connection);
			makeConnectionBlue(connection);
			const isToBeRemoved = askToRemove(connection);
			if (isToBeRemoved) {
				await remove(connection);
			} else {
				keep(connection);
			}
		}
		return resolve();
	});
}

async function remove(connection) {
	return new Promise((resolve) => {
		openRemoveDropdown(connection);
		makeConnectionRed(connection);
		setTimeout(async () => {
			await confirmRemoval(connection);
			return resolve();
		}, awaitTime);
	});
}

async function confirmRemoval(connection) {
	return new Promise((resolve) => {
		clickRemoveButton(connection);
		setTimeout(() => {
			clickConfirmRemoval(document)
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
	const button = connection.getElementsByTagName('span')[6];
	if (button.innerText === removeText) {
		return button;
	} else {
		for (const span of connection.getElementsByTagName('span')) {
			if (button.innerText === removeText) {
				return button;
			}
		}
	}
	console.error('Could not find the remove button to click, sorry! :(')
}
function getRemoveConfirmModal(document) {
	return document.getElementsByClassName(modalClassName)[0];
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

/**
 * ---------------------------------
 * VOCABULARY
 * ---------------------------------
 * - Connection: a user we are connected to, like a Facebook friend
 */
