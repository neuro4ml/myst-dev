# Quickstart Guide
## For use with the Neuro4ML custom book-theme

### Installation
1. Clone from the Neuro4ML myst-dev repo with recursive:
```
git clone --recursive https://github.com/neuro4ml/myst-dev.git
```
2. Install node packages:
```
cd myst-dev
npm install
```
3. Do __NOT__ use ```npm audit fix --force```. Only use ```npm audit fix``` if the following chapter does not work.

### Development
1. Theme development works by hosting a content server for the MyST documents and a __Remix__ server for the theme you're developing.
First in your MyST md content directory, run:
```
myst start --headless
```
_No webpage or preview is expected at this stage._

2. Render the theme by navigating to the ```myst-dev``` directory and running:
```
npm run theme:book
```
3. Finally, run the development process in the same ```myst-dev``` directory, but new terminal:
```
npm run dev
```
4. Your webpage should now be live at ```localhost:3000``` or nearest available port (check terminal). Updates in contents or theme are rebuilt live by Remix.

### Component Structure