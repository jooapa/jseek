# jseek - search anything

## Searching

You can search for anything, you can filter results, using following keywords:

- **`<anything>`** Search for anything (file, folder, program, web..)
- **`f:<>`** **`fi:<>`** Search for files
- **`d:<>`** **`fo:<>`**  Search for folders

- **`ext:extension`** **`*.<ext>`** Search for files with extension
- **`size:<>`** Search for files with size
- [And more...](./src/config.js)

- **`$:<>`** Search programs in PATH, Start Menu..
- **`eg. 1(2+4)`** Calculate math expression
  - **`eg. 1(2+4) -> [hex|bin|oct]`** Convert math expression to hex, bin, oct
  - **`[hex|bin|oct] -> [hex|bin|oct|dec]`** Convert number to hex, bin, oct, dec
- Web search
  - **`?<>`** Search for web using default search engine and browser
    - **`?g<>`** Search for web using Google
    - **`?y<>`** Search for web using Yahoo
    - **`?b<>`** Search for web using Bing
    - **`?d<>`** Search for web using DuckDuckGo
    - **`?w<>`** Search for web using Wikipedia
- **`><>`** Run command
  - **`><>!`** Run command in elevated mode
  - **`><>~`** Run command in hidden mode
  - **`><>~!`** Run command in hidden mode in elevated mode

Without adding any keyword, it will search for the best match.
