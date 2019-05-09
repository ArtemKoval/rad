import {Statuses} from './OrderStatuses'
import {Order} from './index'
import Processor from './OrderProcessor'
import {paymentsAppURI} from '../../config'

class OrderService {
  constructor () {
    this.orderProcessor = new Processor()
  }

  create (body) {
    let options = {
      method: 'POST',
      uri: paymentsAppURI,
      body: {
        body
      },
      json: true
    }
    body.status = Statuses.CREATED
    return Order.create(body)
      .then((order) => {
        return this.orderProcessor.makePaymentRequest(options, order)
      })
      .then((paymentResponse) => {
        return new Promise((resolve, reject) => {
          Order.findById(paymentResponse.order_id)
            .then((order) => order ? Object.assign(order,
              {payment_id: paymentResponse.id}).save() : null)
            .then(resolve)
            .catch((err) => {
              reject(err)
            })
        })
      })
      .catch((err) => {
        throw new Error(err)g
      })
  }
}

export default OrderService
