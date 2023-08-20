'use strict'

function onInit() {
    renderBooksTable()
    renderFilterByQueryParams()
    renderBooksByPrice()
}

function renderBooks() {
    const viewBy = getViewBy()
    viewBy === 'table' ? renderBooksTable() : renderBooksList()
}

function renderBooksTable() {
    const books = getBooks()
    const strHtml = books.map((book) => `
    <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td>
            <button class="read-btn" onclick="onReadBook(${book.id})">Read</button>
            <button class="update-btn" onclick="onUpdateBook(${book.id})">Update</button>
            <button class="delete-btn" onclick="onDeleteBook(event,${book.id})">Delete</button>
            </td>
            <td>${book.rate}</td>
            <td><input class="user-rate" type="number" min="0" max="10" value="0"></td>
          </tr>   
    `).join('')
    setElHtml('table-body', strHtml)
}

function renderBooksByPrice() {
    var expensive = getExpansiveBooks()
    var normal = getNormalBooks()
    var cheap = getCheapBooks()
    var strHtml =
        `<tr>
    <td>${expensive.length},${expensive.map((expensive => expensive.title))}</td>
    <td>${normal.length},${normal.map((normal => normal.title))}</td>
    <td>${cheap.length},${cheap.map((cheap => cheap.title))}</td>
    </tr>`
    setElHtml('table-footer', strHtml)
}

function renderBooksList() {
    const books = getBooks()
    const strHtml = books.map((book) => `
    <div class="user-card">
        <p><strong>book id:</strong> ${book.id}</p>
        <p><strong>title:</strong> ${book.title}</p>
        <p><strong>price:<br></strong>${book.price}</p>
        <p> <button class="read-btn" onclick="onReadBook(${book.id})">Read</button>
        <button class="update-btn" onclick="onUpdateBook(${book.id})">Update</button>
        <button class="delete-btn" onclick="onDeleteBook(event,${book.id})">Delete</button></p>
        <p><strong>rate:</strong> ${book.rate}</p>
        <p><input class="user-rate" type="number" min="0" max="10" value="0"></p>
        <br>
    </div>
    `).join('')

    setElHtml('books-list', strHtml)
}

function onToggleDisplay(ev) {
    console.log(ev);

    const viewBy = ev.target.checked ? 'list' : 'table'
    setViewBy(viewBy)
    const isTableView = viewBy === 'table'
    handleClassEl('hidden', 'list-container', isTableView)
    handleClassEl('hidden', 'table-container', !isTableView)
    saveToStorage('favLayout', viewBy)
    renderBooks()
}

function onNextPage() {
    var elBtn = document.querySelector('.page span')
    if (elBtn.innerText === 'Next') {
        elBtn.innerText = 'Prev'
    } else {
        elBtn.innerText = 'Next'
    }
    nextPage()
    renderBooksTable()
}
function onDeleteBook(event, bookId) {
    console.log(event.target);
    removeBook(bookId)
    renderBooksTable()
}

function onAddBook() {
    var name = prompt('name?')
    var price = +prompt('price?')
    if (name && price) {
        addBook(name, price)
        renderBooksTable()
    }
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('new price?', book.price)

    if (newPrice && book.price !== newPrice) {
        updateBook(bookId, newPrice)
        renderBooksTable()
    }
}

function flashMsg(msg) {
    const elMsg = document.querySelector('.user-msg')

    elMsg.innerText = msg
    elMsg.classList.add('open')
    setTimeout(() => elMsg.classList.remove('open'), 3000)
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')
    elModal.querySelector('h2').innerText = book.title
    elModal.querySelector('h3').innerText = makeLorem()
    elModal.querySelector('h4').innerHTML = `<input class="user-rate" type="number" min="0" max="10" value="0">`
    elModal.classList.add('open')
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}


function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooksTable()

    const queryParams = `?rate=${filterBy.rate}&search=${filterBy.search}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams

    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const filterBy = {
        minRate: queryParams.get('rate') || 0,
        searchBox: queryParams.get('search') || ''
    }

    if (!filterBy.rate && !filterBy.search) return

    document.querySelector('.filter-search').value = filterBy.search
    document.querySelector('.filter-range').value = filterBy.rate
    onSetFilterBy(filterBy)
    renderBooksTable()
}

function onSetBookSort(elSortBy) {
    console.log(elSortBy);
    setBookSort(elSortBy.value)
    renderBooksTable()
}


