export type error = {
  name: string,
  status: number,
  statusText: string
}

export type cartItem = {
  item_id?: number,
  sku: string,
  qty: number,
  quote_id: string | number
}

export type cart = {
  id?: number,
  created_at?: string,
  updated_at?: string,
  converted_at?: string,
  is_active?: boolean,
  is_virtual?: boolean,
  items?: cartItem[],
  items_count?: number,
  items_qty?: number,
  customer?: object,
  billing_address?: object,
  reserved_order_id?: string,
  orig_order_id?: number,
  currency?: object,
  customer_is_guest?: boolean,
  customer_note?: string,
  customer_note_notify?: boolean,
  customer_tax_class_id?: number,
  store_id?: number,
  extension_attributes?: object
  [propName: string]: any
}

export type shippingMethod = {
  carrier_code?: string,
  method_code?: string,
  carrier_title?: string,
  method_title?: string,
  amount?: number,
  base_amount?: number,
  available?: boolean,
  extension_attributes?: object,
  error_message?: string,
  price_excl_tax?: number,
  price_incl_tax?: number
}

export type address = {

  id?: number,
  region?: string,
  region_id?: number,
  region_code?: string,
  country_id?: string,
  street?: string[],
  company?: string,
  telephone?: string,
  fax?: string,
  postcode?: string,
  city?: string,
  firstname?: string,
  lastname?: string,
  middlename?: string,
  prefix?: string,
  suffix?: string,
  vat_id?: string,
  customer_id?: number,
  email?: string,
  same_as_billing?: number,
  customer_address_id?: number,
  save_in_address_book?: number,
  extension_attributes?: Object,
  custom_attributes?: [],
  [propName: string]: any

}

export type addressInformation = {

    shipping_address: address,
    billing_address: address,
    shipping_method_code: string,
    shipping_carrier_code: string,
    extension_attributes?: object,
    custom_attributes?: string[]
}

export type paymentMethod = {
  code: string,
  title: string
}

export type totals = {

  grand_total?: number,
  base_grand_total?: number,
  subtotal?: number,
  base_subtotal?: number,
  discount_amount?: number,
  base_discount_amount?: number,
  subtotal_with_discount?: number,
  base_subtotal_with_discount?: number,
  shipping_amount?: number,
  base_shipping_amount?: number,
  shipping_discount_amount?: number,
  base_shipping_discount_amount?: number,
  tax_amount?: number,
  base_tax_amount?: number,
  weee_tax_applied_amount?: number,
  shipping_tax_amount?: number,
  base_shipping_tax_amount?: number,
  subtotal_incl_tax?: number,
  base_subtotal_incl_tax?: number,
  shipping_incl_tax?: number,
  base_shipping_incl_tax?: number,
  base_currency_code?: string,
  quote_currency_code?: string,
  coupon_code?: string,
  items_qty?: number,
  items?: Object[],
  total_segments?: Object[],
  extension_attributes?: Object
}

export type invoice = {

  base_currency_code: string,
  base_discount_amount: number,
  base_grand_total: number,
  base_discount_tax_compensation_amount: number,
  base_shipping_amount: number,
  base_shipping_discount_tax_compensation_amnt: number,
  base_shipping_incl_tax: number,
  base_shipping_tax_amount: number,
  base_subtotal: number,
  base_subtotal_incl_tax: number,
  base_tax_amount: number,
  base_total_refunded: number,
  base_to_global_rate: number,
  base_to_order_rate: number,
  billing_address_id: number,
  can_void_flag: number,
  created_at: string,
  discount_amount: number,
  discount_description: string,
  email_sent: number,
  entity_id: number,
  global_currency_code: string,
  grand_total: number,
  discount_tax_compensation_amount: number,
  increment_id: string,
  is_used_for_refund: number,
  order_currency_code: string,
  order_id: number,
  shipping_address_id: number,
  shipping_amount: number,
  shipping_discount_tax_compensation_amount: number,
  shipping_incl_tax: number,
  shipping_tax_amount: number,
  state: number,
  store_currency_code: string,
  store_id: number,
  store_to_base_rate: number,
  store_to_order_rate: number,
  subtotal: number,
  subtotal_incl_tax: number,
  tax_amount: number,
  total_qty: number,
  transaction_id: string,
  updated_at: string,
  items?: Object[],
  comments?: Object[],
  extension_attributes?: Object
}

export type track = {
  extension_attributes?: Object,
  track_number: string,
  title: string,
  carrier_code: string
}

export type shippement = {
  items: Object[],
  notify: boolean,
  appendComment: boolean,
  comment: Object,
  tracks: track[],
  packages: Object[],
  arguments: Object
}