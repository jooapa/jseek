const os = require('os'); // Import the os module

const debug = true;

/// intesity: means how much the macro should be used in the search query, meaning how much it will lag the search
const Keywords = [
    // [
    //     [':'],
    //     ['Search for All the volumes'],
    //     ["intensity", 0],
    // ],
    
    // Start commands
    // [
    //     ['>'],
    //     ['Run a command'],
    //     ["intensity", -1],
    //     ["start", true],
    //     ["startSpaceMatters", false],
    // ],
    [
        ['!'],
        ['Search for files From the Recent Files'],
        ["intensity", -1],
        ["start", true],
        ["startSpaceMatters", false],
    ],
    [
        ['g'],
        ['Search for web using Google'],
        ["intensity", -1],
        ["start", true],
        ["startSpaceMatters", true],
    ],
    [
        ['y'],
        ['Search for web using Yahoo'],
        ["intensity", -1],
        ["start", true],
        ["startSpaceMatters", true],
    ],
    [
        ['b'],
        ['Search for web using Bing'],
        ["intensity", -1],
        ["start", true],
        ["startSpaceMatters", true],
    ],
    [
        ['d'],
        ['Search for web using DuckDuckGo'],
        ["intensity", -1],
        ["start", true],
        ["startSpaceMatters", true],
    ],
    [
        ['w'],
        ['Search for web using Wikipedia'],
        ["intensity", -1],
        ["start", true],
        ["startSpaceMatters", true],
    ],
    [
        ['#:'],
        ['Search for the Recent files'],
        ["intensity", -1],
        ["start", true],
    ],
    [
        ['p:'],
        ['Search for the programs'],
        ["intensity", -1],
        ["start", false],
    ],
    [
        ['quot:'],
        ['Literal double quote "'],
        ["intensity", -1],
    ],
    [
        ['apos:'],
        ['Literal apostrophe \''],
        ["intensity", -1],
    ],
    [
        ['amp:'],
        ['Literal ampersand &'],
        ["intensity", -1],
    ],
    [
        ['lt:'],
        ['Literal less than <'],
        ["intensity", -1],
    ],
    [
        ['gt:'],
        ['Literal greater than >'],
        ["intensity", -1],
    ],
    [
        ['#<n>'],
        ['Literal unicode character <n> in decimal.'],
        ["intensity", -1],
    ],
    [
        ['#x<n>'],
        ['Literal unicode character <n> in hexadecimal.'],
        ["intensity", -1],
    ],
    [
        ['<', '>', '>=', '<=', '==', '!='],
        ['Comparison operators.'],
        ["intensity", -1],
    ],
    [
        ['audio:'],
        ['Search for audio files.'],
        ["intensity", 0],
    ],
    [
        ['zip:'],
        ['Search for compressed files.'],
        ["intensity", 0],
    ],
    [
        ['doc:'],
        ['Search for document files.'],
        ["intensity", 0],
    ],
    [
        ['exe:'],
        ['Search for executable files.'],
        ["intensity", 0],
    ],
    [
        ['pic:'],
        ['Search for picture files.'],
        ["intensity", 0],
    ],
    [
        ['video:'],
        ['Search for video files.'],
        ["intensity", 0],
    ],
    // Modifiers
    [
        ['ascii:', 'utf8:', 'noascii:'],
        ['Enable or disable fast ASCII case comparisons.'],
        ["intensity", 0],
    ],
    [
        ['case:', 'nocase:'],
        ['Match or ignore case. Default is to ignore case.'],
        ["intensity", 0],
    ],
    [
        ['diacritics:', 'nodiacritics:'],
        ['Match or ignore accent marks.'],
        ["intensity", 0],
    ],
    [
        ['file:', 'files:', 'nofileonly:'],
        ['Match files only.'],
        ["intensity", 0],
    ],
    [
        ['folder:', 'folders:', 'nofolderonly:'],
        ['Match folders only.'],
        ["intensity", 0],
    ],
    [
        ['path:', 'nopath:'],
        ['Match the full path and file name or just the filename.'],
        ["intensity", 0],
    ],
    [
        ['regex:', 'noregex:'],
        ['Enable or disable regex.'],
        ["intensity", 0],
    ],
    [
        ['wfn:', 'wholefilename:', 'nowfn:', 'nowholefilename:'],
        ['Match the whole filename or match anywhere in the filename.'],
        ["intensity", 0],
    ],
    [
        ['wholeword:', 'ww:', 'nowholeword:', 'noww:'],
        ['Match whole words or match anywhere in the filename.'],
        ["intensity", 0],
    ],
    [
        ['wildcards:', 'nowildcards:'],
        ['Enable or disable wildcards.'],
        ["intensity", 0],
    ],
    // Functions
    [
        ['dupe:', 'attribdupe:', 'sizedupe:', 'dadupe:', 'dcdupe:', 'dmdupe:'],
        ['Search for duplicated files.'],
        ["intensity", 0],
    ],
    [
        ['namepartdupe:'],
        ['Search for duplicated files.'],
        ["intensity", 50],
    ],
    [
        ['album:'],
        ['Search for the ID3 or FLAC album.'],
        ["intensity", 100],
    ],
    [
        ['artist:'],
        ['Search for the ID3 or FLAC artist.'],
        ["intensity", 100],
    ],
    [
        ['attrib:', 'attributes:'],
        ['Search for files and folders with the specified file attributes.'],
        ["intensity", 100],
    ],
    [
        ['bitdepth:'],
        ['Find images with the specified bits per pixel.'],
        ["intensity", 100],
    ],
    [
        ['child:'],
        ['Search for folders that contain a child file or folder with a matching filename.'],
        ["intensity", 0],
    ],
    [
        ['childcount:'],
        ['Search for folders that contain the specified number of subfolders and files.'],
        ["intensity", 0],
    ],
    [
        ['childfilecount:'],
        ['Search for folders that contain the specified number of files.'],
        ["intensity", 0],
    ],
    [
        ['childfoldercount:'],
        ['Search for folders that contain the specified number of subfolders.'],
        ["intensity", 0],
    ],
    [
        ['comment:'],
        ['Search for the ID3 or FLAC comment.'],
        ["intensity", 100],
    ],
    [
        ['content:', 'ansicontent:', 'utf8content:', 'utf16content:', 'utf16becontent:'],
        ['Search file content.'],
        ["intensity", 100],
    ],
    [
        ['dateaccessed:', 'da:'],
        ['Search for files and folders with the specified date accessed.'],
        ["intensity", 100],
    ],
    [
        ['datecreated:', 'dc:'],
        ['Search for files and folders with the specified date created.'],
        ["intensity", 100],
    ],
    [
        ['datemodified:', 'dm:'],
        ['Search for files and folders with the specified date modified.'],
        ["intensity", 0],
    ],
    [
        ['daterun:', 'dr:'],
        ['Search for files and folders with the specified date run.'],
        ["intensity", 0],
    ],
    [
        ['depth:', 'parents:'],
        ['Search for files and folders with the specified folder depth.'],
        ["intensity", 0],
    ],
    [
        ['dimension:'],
        ['Find images with the specified width and height.'],
        ["intensity", 100],
    ],
    [
        ['empty:'],
        ['Search for empty folders.'],
        ["intensity", 0],
    ],
    [
        ['endwith:'],
        ['Filenames (including extension) ending with text.'],
        ["intensity", 0],
    ],
    [
        ['ext:'],
        ['Search for files with a matching extension in the specified semicolon delimited extension list.'],
        ["intensity", 0],
    ],
    [
        ['filelist:'],
        ['Search for a list of file names in the specified pipe (|) delimited file list.'],
        ["intensity", 0],
    ],
    [
        ['filelistfilename:'],
        ['Search for files and folders belonging to the file list filename.'],
        ["intensity", 0],
    ],
    [
        ['frn:'],
        ['Search for files and folders with the specified semicolon delimited File Reference Numbers.'],
        ["intensity", 0],
    ],
    [
        ['fsi:'],
        ['Search for files and folders in the specified zero based internal file system index.'],
        ["intensity", 0],
    ],
    [
        ['genre:'],
        ['Search for the ID3 or FLAC genre.'],
        ["intensity", 100],
    ],
    [
        ['width:'],
        ['Search for images with the specified width in pixels.'],
        ["intensity", 100],
    ],
    [
        ['height:'],
        ['Search for images with the specified height in pixels.'],
        ["intensity", 100],
    ],
    [
        ['len:'],
        ['Search for files and folders that match the specified filename length.'],
        ["intensity", 0],
    ],
    [
        ['orientation:'],
        ['Search for images with the specified orientation (landscape or portrait).'],
        ["intensity", 100],
    ],
    [
        ['parent:', 'infolder:', 'nosubfolders:'],
        ['Search for files and folders in the specified path, excluding subfolders.'],
        ["intensity", 0],
    ],
    [
        ['recentchange:', 'rc:'],
        ['Search for files and folders with the specified recently changed date.'],
        ["intensity", 0],
    ],
    [
        ['root:'],
        ['Search for files and folders with no parent folder.'],
        ["intensity", 0],
    ],
    [
        ['count:'],
        ['Search for files and folders with the specified file count.'],
        ["intensity", 0],
    ],
    [
        ['runcount:'],
        ['Search for files and folders with the specified run count.'],
        ["intensity", 0],
    ],
    [
        ['shell:'],
        ['Search for a known shell folder name, including subfolders and files.'],
        ["intensity", 0],
    ],
    [
        ['size:'],
        ['Search for files with the specified size in bytes.'],
        ["intensity", 0],
    ],
    [
        ['startwith:'],
        ['Search for filenames starting with text.'],
        ["intensity", 0],
    ],
    [
        ['title:'],
        ['Search for the ID3 or FLAC title.'],
        ["intensity", 100],
    ],
    [
        ['type:'],
        ['Search for files and folders with the specified file type.'],
        ["intensity", 0],
    ]
];

const SizeInfo  = [
    [
        `size[kb|mb|gb]
            Size Constants:
                empty	
                tiny	   0 KB < size <= 10 KB
                small	   10 KB < size <= 100 KB
                medium	   100 KB < size <= 1 MB
                large	   1 MB < size <= 16 MB
                huge	   16 MB < size <= 128 MB
                gigantic   size > 128 MB
                
        Example:
            size:medium
            size:<1mb
            size:small
            size:empty`,
    ]
]

const DateInfo = [
    `year
    month/year or year/month depending on locale settings
    day/month/year, month/day/year or year/month/day depending on locale settings
    YYYY[-MM[-DD[Thh[:mm[:ss[.sss]]]]]]
    YYYYMM[DD[Thh[mm[ss[.sss]]]]]
    
    Date Constants:
    today
    yesterday
    <last|past|prev|current|this|coming|next><year|month|week>
    <last|past|prev|coming|next><x><years|months|weeks>
    <last|past|prev|coming|next><x><hours|minutes|mins|seconds|secs>
    january|february|march|april|may|june|july|august|september|october|november|december
    jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec
    sunday|monday|tuesday|wednesday|thursday|friday|saturday
    sun|mon|tue|wed|thu|fri|sat
    unknown
    
    Example:
    datemodified:today`,
]

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/ /g, "&nbsp;");
}

function highlightResults(input, highlight) {
    // find highlight in input and wrap it in <span class="highlight"> tags
    // return the modified input

    // hightlight example: "num query going here"
    // remove the number from the start

    highlight = highlight.substring(highlight.indexOf(' ') + 1);

    if (!input || !highlight) {
        return input;
    }

    // Escape special characters in the highlight string to safely use it in regex
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const escapedHighlight = escapeRegExp(highlight);
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');

    return input.replace(regex, '<span class="highlight">$1</span>');
}

function contructBlock(path, name, type, displayName, infoName, originalQuery, isPerma, image) {
    console.log("path: ", path);
    let betterPath = path.replace(/"/g, '&quot;');
    console.log("betterPath: ", betterPath);
    let escapedType = type.replace(/"/g, '&quot;');
    let escapedDisplayName = displayName.replace(/"/g, '&quot;');
    let escapedInfoName = infoName.replace(/"/g, '&quot;');
    let escapedOriginalQuery = originalQuery.replace(/"/g, '&quot;');

    let idName = "block";
    if (type === "Web") {
        idName = "web";
    }
    let perma = "";
    if (isPerma) {
        perma = " perma";
    }

    return `<div id="${idName}" class="block${perma}" data-type="${escapedType}" data-path="${betterPath}" onclick="openFile('${betterPath}', '${escapedType}')">
        <img src="${image}">
        <div class="info">
            <!-- <h2 class="name"> ${highlightResults(escapedDisplayName, escapedOriginalQuery)} </h2> -->
            <!-- <p class="path"> ${highlightResults(escapedInfoName, escapedOriginalQuery)} </p> -->

            <h2 class="name"> ${escapeHtml(escapedDisplayName)} </h2>
            <p class="path"> ${escapeHtml(escapedInfoName)} </p>
        </div>
    </div>`;
}

function getUsername() {
    return os.userInfo().username;
}

module.exports = {
    debug,
    Keywords,
    SizeInfo,
    DateInfo,
    contructBlock,
    getUsername,
};