

$(function () {
    var date = new Date();
    var startHours = 9;
    var endHours = 17;
    var nowHours = date.getHours();
    var header_link = document.getElementById('freecall_header');
    var block_link = document.getElementById('freecall_block');
    var contact_link = document.getElementById('contact_freecall');

    if (nowHours < startHours || endHours < nowHours) {

        if (header_link !== null) {
            header_link.setAttribute('href', 'javascript:void(0);');
        }
        if (block_link !== null) {
            block_link.setAttribute('href', 'javascript:void(0);');
        }
        if (contact_link !== null) {
            contact_link.setAttribute('href', 'javascript:void(0);');
        }

        $('#freecall_header').on('click', function () {
            $('.modal-area').toggleClass('on');
        });
        $('#freecall_block').on('click', function () {
            $('.modal-area').toggleClass('on');
        });
        $('#contact_freecall').on('click', function () {
            $('.modal-area').toggleClass('on');
        });
        $('#freecall_modal_close').on('click', function () {
            $('.modal-area').toggleClass('on');
        });
    }
});



