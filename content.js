


chrome.runtime.onMessage.addListener((request) => {
    if (request.action == "activate_search_mode") {
    }
});




document.addEventListener('keydown', (e) => {
    if (!e.altKey) return;

    const num = parseInt(e.key);
    if (isNaN(num) || num < 1 || num > 9) return;

    e.preventDefault();

    const results = getSearchResults();
    const target = results[num - 1];

    if (target) {
        window.open(target.href, '_blank');
    }
});


function getSearchResults() {
    const rso = document.querySelector('#rso');
    if (!rso) return [];

    return [...rso.querySelectorAll('a[jsname="UWckNb"]')]
        .filter(a => {
            if (!a.href.startsWith('http')) return false;
            if (a.closest('[jsname="yEVEwb"]')) return false; //People Also Ask section
            return true;
        });

}
