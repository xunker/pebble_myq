# pebble_myq

### Notes

For this version, make things easy:
  * Don't store the SecurityToken between program runs
    - Log user in every time the program launches
  * Don't deal with multiple openers; just use the first one found
  * Don't store the ID of the opener between program runs
    - Query for it every time the programs runs

### network failure states

For any ajax call that fails (calls failure callback), use a standard
"network call failure card", non-modal (don't hide other cards before showing
it). This means it may be modal by default if there are no other cards shown
yet (like when initially launching the app).

### authentication failure states

For any ajax call that succeeds but the json ReturnCode is -3333, use the
standard checkCredentialsCard, non-modal (don't hide other cards before showing
it). This means it may be modal by default if there are no other cards shown
yet (like when initially launching the app).

### device not found states

When querying for a device status/attribute and return code is 109, fallback
to a flow that reloads the device list and finds the first VGDO. Stash the ID
of that VGDO and return.

### UI Flow

#### Launch

```
Launch
  |
no other cards
visible yet
  |
Have credentials? --n-- show pleaseConfigureCard
  |
  y
  |
Show loadingCard
  |
Log in
  |
Get Devices
  |
Devices present? --n-- hide loadingCard, show noVGDOFoundCard
  |
  y
  |
VGDO found? --n-- hide loadingCard, show noVGDOFoundCard
  |
  y
  |
Stash VGDO ID
  |
Get VGDO State
  |
Stash VGDO State
  |
Hide loadingCard
  |
Show mainCard with
current VGDO device
and Stashed State
```

#### Open/Close VGDO from mainCard

```
user on mainCard
  |
Open/Close requested
  |
Show loadingCard
  |
hide mainCard
  |
Get VGDO state
  |
VGDO Found? --n-- reload devices, find VGDO and get current state
  |
  y
  |
State is open or closed? --n-- hide loadingCard, show mainCard and cannotChangeStateCard
  |
  y
  |
Send appropriate open/close command
depending on current state
  |
show changeStateStatusCard
  |
hide loadingCard
  |
Get VGDO state
  |
State is open
or closed?    --n-- refresh text on changeStateStatusCard
  |
  y
  |
update VGDO device
and VGDO state
on mainCard
  |
show mainCard
  |
Hide changeStateStatusCard
```

#### Refresh from mainCard

```
user on mainCard
  |
show loadingCard
  |
hide mainCard
  |
Get VGDO state
  |
VGDO Found? --n-- reload devices, find VGDO and get current state
  |
Stash VGDO State
  |
update VGDO device
and VGDO state
on mainCard
  |
show mainCard
  |
hide loadingCard

#### menu from mainCard

user on mainCard
  |
Update "about" and links
to source
  |
show menuCard

#### user info from menuCard

user on menuCard
  |
Choose user info option
  |
show loadingCard
  |
get user info from API
  |
set details on userInfoCard:
BrandName
CountryName
FirstName
LastName
StreetPostalCode
  |
show userInfoCard
```


