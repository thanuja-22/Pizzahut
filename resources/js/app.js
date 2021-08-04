import axios from 'axios';
import {initAdmin} from './admin';
import moment from 'moment'
let addToCart=document.querySelectorAll(".add-to-cart");
let cartCounter=document.querySelector("#cartCounter");
function updatecart(pizza){
   axios.post('/update-cart',pizza).then(function(res){
     console.log(res.data);
     // cartCounter.innerText=res.data.totalQty;
   });
}
addToCart.forEach((btn)=>{
  btn.addEventListener('click',(e)=>{
    let pizza=JSON.parse(btn.dataset.pizza);
    updatecart(pizza);
     console.log(pizza);
  })
})
initAdmin();
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let statuses = document.querySelectorAll('.status_line')
let time = document.createElement('small')


function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);
// Socket
let socket = io()

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})
