import {success, notFound} from '../../services/response/'
import {Payment} from '.'

export const create = ({bodymen: {body}}, res, next) => {
  Payment.create(body)
    .then((payment) => payment.view(true))
    .then(success(res, 201))
    .catch(next)
}

export const index = ({querymen: {query, select, cursor}}, res, next) =>
  Payment.find(query, select, cursor)
    .then((payments) => payments.map((payment) => payment.view()))
    .then(success(res))
    .catch(next)

export const show = ({params}, res, next) =>
  Payment.findById(params.id)
    .then(notFound(res))
    .then((payment) => payment ? payment.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({bodymen: {body}, params}, res, next) =>
  Payment.findById(params.id)
    .then(notFound(res))
    .then((payment) => payment ? Object.assign(payment, body).save() : null)
    .then((payment) => payment ? payment.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({params}, res, next) =>
  Payment.findById(params.id)
    .then(notFound(res))
    .then((payment) => payment ? payment.remove() : null)
    .then(success(res, 204))
    .catch(next)
