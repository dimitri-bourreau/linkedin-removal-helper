# linkedin-removal-helper
Script to remove several connections with people

## How to

- Go to: https://www.linkedin.com/mynetwork/invite-connect/connections/
- _optional: sort by name, it's easier_
- Open your console (search online how to open your brower's console if needed)
- Copy paste the content from script.js above.

## Common errors

### Program stops without reason

LinkedIn sometimes takes more time than usual to display a button on screen.

For now, the program will only wait 200ms for this button.

Sometimes, 200ms are not enough for LinkedIn to display the remove button the program is trying to reach.

I did not (yet ?) implement a retry on this fail. For not, please refresh and paste the code in the console once more.
