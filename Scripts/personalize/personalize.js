function personalize() {
    // container
    this.container = null;
    // init component 
    this.init();
}
//init function
personalize.prototype.init = function() {
    this.container = document.getElementById('gridbtn');
    this.container.querySelectorAll('.round-img-btn').forEach(function(btn) {
        btn.addEventListener('click', this.OnBtnClick.bind(this));
    }, this);
};
//cambio de vista evento de los botones
personalize.prototype.OnBtnClick = function(e) {
    var btnContainer = e.target.closest('.btn-conteiner');
    if (btnContainer.classList.contains('active')) return;
    if (!this.container.classList.contains('collapse-btn')) {
        this.container.classList.add('collapse-btn');
        btnContainer.classList.add('active');
        return;
    }

    this.container.querySelector('.active').classList.remove('active');
    btnContainer.classList.add('active');
};