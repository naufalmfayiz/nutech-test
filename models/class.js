class User {
  constructor(id, first_name, last_name, email, password, balance) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password = password;
    this.balance = balance;
  }
}

class Transaction {
  constructor(
    id,
    user_id,
    invoice_number,
    service_code,
    service_name,
    transaction_type,
    total_amount,
    created_on
  ) {
    this.id = id;
    this.user_id = user_id;
    this.invoice_number = invoice_number;
    this.service_code = service_code;
    this.service_name = service_name;
    this.transaction_type = transaction_type;
    this.total_amount = total_amount;
    this.created_on = created_on;
  }
}

module.exports = { User, Transaction };
