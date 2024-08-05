//Declarare si initializare variabile pentru numarul de randuri si coloane ale tablei de joc.
var rows = 3;
var columns = 3;

//Variabilele currTile si otherTile sunt folosite pentru a stoca datele pieselor puzzle-ului (care sunt trase și pe care sunt plasate cele trase)
var currTile;
var otherTile; //piesa alba peste care se pot trage [iesele din jur]

//Variabila turns este folosita pentru a numara miscarile efectuate
var turns = 0;

// Ordinea imaginilor pentru ca puzzle-ul sa fie corect este ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Variabila imgOrder contine ordinea initiala a imaginilor care reprezinta piesele puzzle-ului
var imgOrder = ["images/4", "images/1", "images/2", "images/7", "images/5", "images/3", "images/8", "images/9", "images/6"];


//Atunci cand fereastra se încarcă (window.onload), este creată tabla de joc cu piesele puzzle-ului plasate in ordinea specificată de variabila imgOrder
window.onload = function() {
    for (let r=0; r < rows; r++) {
        for (let c=0; c < columns; c++) {

            //<img id="0-0" src="images/1.jpg">
            //Pentru fiecare pozitie din tabela, se creeaza o imagine (<img>) cu un ID unic si o sursă (src) care corespunde imaginii din imgOrder.
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = imgOrder.shift() + ".jpg";

            //DRAG FUNCTIONALITY
            //Ataseaza evenimente de drag&drop ale acestor imagini pentru a permite functionalitatea de glisare.
            tile.addEventListener("dragstart", dragStart);  //fa click pe piesa pe care vrei sa o muti
            tile.addEventListener("dragover", dragOver);    //muta piesa in jur cat timp este click-ul facut
            tile.addEventListener("dragenter", dragEnter);  //trage piesa peste o piesa invecinata
            tile.addEventListener("dragleave", dragLeave);  //piesa trasa este lasata pe piesa peste care a fost trasa
            tile.addEventListener("drop", dragDrop);        //trage piesa peste piesa alba si da-i drumul (drag&drop)
            tile.addEventListener("dragend", dragEnd);      //se inclocuiesc cele 2 piese dupa drag&drop

            document.getElementById("board").append(tile);

        }
    }
    document.getElementById("refreshButton").addEventListener("click", refreshPage);
}

//Functia dragStart este apelata atunci cand incepe tragerea unei piese (tile). Aceasta seteaza variabila currTile pentru a stoca piesa trasa.
function dragStart() {
    currTile = this; 
}

//Functiile dragOver dragEnter si dragLeave sunt utilizate pentru a gestiona evenimentele asociate cu tragerea si plasarea unei piese peste o alta piesa. 
function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}
//Funcția dragDrop este apelata atunci cand o piesa este plasată peste alta. Aceasta setează variabila otherTile pentru a stoca piesa pe care s-a plasat cealalta piesa.
function dragDrop() {
    otherTile = this;
}

//Functia refreshPage va reincarca pagina html (folosita pentru butonul New Game).
function refreshPage() {
    location.reload();
}

//Functia dragEnd este apelata dupa ce tragerea si plasarea piesei s-a terminat. Aceasta verifica daca piesa trasa si cea plasata sunt adiacente (in stanga, dreapta, sus sau jos).
function dragEnd() {
    if (!otherTile.src.includes("1.jpg")) {
        return;
    }

    let currCoords = currTile.id.split("-"); //ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c-1;
    let moveRight = r == r2 && c2 == c+1;

    let moveUp = c == c2 && r2 == r-1;
    let moveDown = c == c2 && r2 == r+1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    //Daca piesele sunt adiacente, imaginile acestora sunt schimbate iar numarul de miscari (turns) este incrementat.
    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;
    }

    //Verificare daca piesele sunt in ordinea corecta si puzzle-ul este rezolvat
    let isPuzzleSolved = true;
    let correctOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tileId = r.toString() + "-" + c.toString();
            let tile = document.getElementById(tileId);
            if (tile.src.endsWith(correctOrder[r * columns + c] + ".jpg") === false) {
                isPuzzleSolved = false;
                break;
            }
        }
        if (!isPuzzleSolved) {
            break;
        }
    }

    // Afisare mesaj castigator daca puzzle-ul este rezolvat cu succes
    if (isPuzzleSolved) {
        let winMessageDiv = document.createElement("div");
        winMessageDiv.innerText = "Felicitări! Ai câștigat!";
        winMessageDiv.style.backgroundColor = "#0f3053"; 
        winMessageDiv.style.color = "#BDCDD6"; 
        winMessageDiv.style.padding = "20px"; 
        winMessageDiv.style.borderRadius = "10px"; 
        winMessageDiv.style.position = "fixed"; 
        winMessageDiv.style.top = "50%"; 
        winMessageDiv.style.left = "20%"; 
        winMessageDiv.style.transform = "translate(-50%, -50%)"; 
        winMessageDiv.style.fontSize = "24px"; 
    
        document.body.appendChild(winMessageDiv);
    }
}

