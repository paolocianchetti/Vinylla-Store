export const emailTemplate = (order) => {
  return `<h1>Grazie per aver concluso affari con noi</h1>
    <p>
    Ciao ${order.user.name},
    </p>
    <p>Abbiamo completato l'elaborazione del tuo ordine.</p>
    <h2>[Ordine ${order._id}] (${order.createdAt
    .toString()
    .substring(0, 10)})</h2>
    <table>
    <thead>
    <tr>
    <td><strong>Vinile</strong></td>
    <td><strong>Quantità</strong></td>
    <td><strong align="right">Prezzo</strong></td>
    </tr>
    </thead>
    <tbody>
    ${order.orderItems
      .map(
        (item) => `
    <tr>
    <td>${item.title}</td>
    <td align="center">${item.quantity}</td>
    <td align="right">€ ${item.price.toFixed(2)}</td>
    </tr>
    `
      )
      .join('\n')}
    </tbody>
    <tfoot>
    <tr>
    <td colspan="2">Prezzo dei dischi:</td>
    <td align="right"> € ${order.itemsPrice.toFixed(2)}</td>    
    </tr>
    <tr>
    <td colspan="2">Spese di spedizione:</td>
    <td align="right"> € ${order.shippingPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2"><strong>Totale:</strong></td>
    <td align="right"><strong> € ${order.totalPrice.toFixed(2)}</strong></td>
    </tr>
    <tr>
    <td colspan="2">Metodo di pagamento:</td>
    <td align="right">${order.paymentMethod}</td>
    </tr>
    </tfoot>
    </table>

    <h2>Da spedire a:</h2>
    <p>
    ${order.shippingData.name}, <br/>
    ${order.shippingData.address}, <br/>
    ${order.shippingData.city}, <br/>
    ${order.shippingData.country}, <br/>
    ${order.shippingData.postalCode}<br/>
    </p>
    <hr/>
    <p>
    Grazie per aver effettuato acquisti da noi.
    </p>
    `;
};
