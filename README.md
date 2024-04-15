# What's That Keyboard

This is a tiny game I created to help me learn **HTML, CSS, and JavaScript** :-)

The concept of the game might be a little out there, but I learned a lot by building it!

## The Game

Without looking at your keyboard, can you remember the positions of all the letter keys?

You may not know the exact arrangement, but perhaps you remember some words you've typed before, that can help you visualize where each letter should go? I think using these words to recall the keyboard is an interesting application of spatial memory. I thought this might be a fun challenge, but it's one-time with the QWERTY layout.

That's more or less the idea of this game. Each day features a different keyboard layout, so the challenge continues on!

You can check out the game at https://maria-mz.github.io/whats-that-keyboard/.<br>
_Please note: Mobile devices aren't supported, and you'll need a keyboard to play._

## The Code

So, I mentioned wanting to learn web technologies...

Indeed, throughout this project I've had to:
- Design and build numerous functional UI components
- Implement various CSS animations and transitions
- Practice responsive design
- Handle events of varying nature, like keyboard inputs and drag-and-drop
- Dynamically update the DOM
- Integrate Web Storage API for persisting game details
- Leverage third-party libraries, like `typo.js` and `seedrandom`, for added functionality
- Document classes and functions with JSDoc

As the project grew, I decided to adopt the **Model-View-Controller (MVC) pattern** for better seperation of concerns and code organization. My next goal was then to learn how to implement the pattern.

The main challenges I faced were:
- Defining the role, or scope of each component
- Deciding how the components would interact with each other

Overall, I think some parts of my implementation are good and clearly resemble the pattern, but others I am not so sure about. I'm glad I went with the pattern though, it was interesting to implement, and I do think it has helped me integrate new features and improvements more easily.

## What's Left

At this point in time, I think the game can stand on its own. But there some are features that would be nice to add:

- Save more stats, like streaks, and add Statistics window.
- Easy and Hard game modes.
- Confirmation pop-ups on button clicks that move from one phase to the next.
- Dark mode?
- Support other keyboard layouts (currently assumes the player is using the QWERTY layout)
- Settings window. Could feature a toggle for light or dark mode, enable/disable confirmation pop-ups, game mode selection...
