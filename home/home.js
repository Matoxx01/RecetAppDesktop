document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('minimize').addEventListener('click', () => {
        window.electron.minimize();
    });

    document.getElementById('max').addEventListener('click', () => {
        window.electron.max();
    });

    document.getElementById('close').addEventListener('click', () => {
        window.electron.close();
    });
});
