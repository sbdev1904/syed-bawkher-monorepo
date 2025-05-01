
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt'
};

exports.Prisma.RackScalarFieldEnum = {
  id: 'id',
  name: 'name',
  location_id: 'location_id',
  capacity: 'capacity',
  current_utilization: 'current_utilization',
  createdAt: 'createdAt'
};

exports.Prisma.BunchScalarFieldEnum = {
  id: 'id',
  name: 'name',
  rack_id: 'rack_id',
  createdAt: 'createdAt'
};

exports.Prisma.UnitScalarFieldEnum = {
  id: 'id',
  name: 'name',
  symbol: 'symbol',
  baseUnit: 'baseUnit',
  conversion_rate: 'conversion_rate'
};

exports.Prisma.InventoryMovementScalarFieldEnum = {
  id: 'id',
  item_id: 'item_id',
  type: 'type',
  quantity: 'quantity',
  note: 'note',
  moved_at: 'moved_at'
};

exports.Prisma.ItemSupplierScalarFieldEnum = {
  id: 'id',
  item_id: 'item_id',
  supplier_id: 'supplier_id',
  price: 'price',
  added_on: 'added_on'
};

exports.Prisma.InventoryItemScalarFieldEnum = {
  item_id: 'item_id',
  item_name: 'item_name',
  item_type: 'item_type',
  bunch_id: 'bunch_id',
  unit_id: 'unit_id',
  quantity: 'quantity'
};

exports.Prisma.CustomerScalarFieldEnum = {
  customer_id: 'customer_id',
  first_name: 'first_name',
  middle_name: 'middle_name',
  last_name: 'last_name',
  add1: 'add1',
  add2: 'add2',
  add3: 'add3',
  add4: 'add4',
  email: 'email',
  mobile: 'mobile',
  office_phone: 'office_phone',
  residential_phone: 'residential_phone',
  last_ordered_date: 'last_ordered_date'
};

exports.Prisma.FabricScalarFieldEnum = {
  fabric_id: 'fabric_id',
  description: 'description',
  available_length: 'available_length',
  fabric_code: 'fabric_code',
  fabric_brand: 'fabric_brand',
  stock_location: 'stock_location',
  image: 'image',
  barcode: 'barcode'
};

exports.Prisma.FabricOrderListScalarFieldEnum = {
  order_id: 'order_id',
  fabric_id: 'fabric_id',
  description: 'description',
  supplier_name: 'supplier_name',
  meters: 'meters',
  ordered_date: 'ordered_date',
  ordered_for: 'ordered_for',
  supplier_id: 'supplier_id'
};

exports.Prisma.FinalJacketMeasurementScalarFieldEnum = {
  measurement_id: 'measurement_id',
  customer_id: 'customer_id',
  orderNo: 'orderNo',
  date: 'date',
  jacket_length: 'jacket_length',
  natural_length: 'natural_length',
  back_length: 'back_length',
  x_back: 'x_back',
  half_shoulder: 'half_shoulder',
  to_sleeve: 'to_sleeve',
  chest: 'chest',
  waist: 'waist',
  collar: 'collar',
  waist_coat_length: 'waist_coat_length',
  sherwani_length: 'sherwani_length',
  other_notes: 'other_notes'
};

exports.Prisma.JacketMeasurementScalarFieldEnum = {
  measurement_id: 'measurement_id',
  customer_id: 'customer_id',
  orderNo: 'orderNo',
  date: 'date',
  jacket_length: 'jacket_length',
  natural_length: 'natural_length',
  back_length: 'back_length',
  x_back: 'x_back',
  half_shoulder: 'half_shoulder',
  to_sleeve: 'to_sleeve',
  chest: 'chest',
  waist: 'waist',
  collar: 'collar',
  waist_coat_length: 'waist_coat_length',
  sherwani_length: 'sherwani_length',
  other_notes: 'other_notes'
};

exports.Prisma.FinalPantMeasurementScalarFieldEnum = {
  measurement_id: 'measurement_id',
  customer_id: 'customer_id',
  orderNo: 'orderNo',
  date: 'date',
  length: 'length',
  inseem: 'inseem',
  waist: 'waist',
  hips: 'hips',
  bottom: 'bottom',
  knee: 'knee',
  other_notes: 'other_notes'
};

exports.Prisma.PantMeasurementScalarFieldEnum = {
  measurement_id: 'measurement_id',
  customer_id: 'customer_id',
  orderNo: 'orderNo',
  date: 'date',
  length: 'length',
  inseem: 'inseem',
  waist: 'waist',
  hips: 'hips',
  bottom: 'bottom',
  knee: 'knee',
  other_notes: 'other_notes'
};

exports.Prisma.FinalShirtMeasurementScalarFieldEnum = {
  measurement_id: 'measurement_id',
  customer_id: 'customer_id',
  orderNo: 'orderNo',
  date: 'date',
  length: 'length',
  half_shoulder: 'half_shoulder',
  to_sleeve: 'to_sleeve',
  chest: 'chest',
  waist: 'waist',
  collar: 'collar',
  other_notes: 'other_notes'
};

exports.Prisma.ShirtMeasurementScalarFieldEnum = {
  measurement_id: 'measurement_id',
  customer_id: 'customer_id',
  orderNo: 'orderNo',
  date: 'date',
  length: 'length',
  half_shoulder: 'half_shoulder',
  to_sleeve: 'to_sleeve',
  chest: 'chest',
  waist: 'waist',
  collar: 'collar',
  other_notes: 'other_notes'
};

exports.Prisma.OrderPhotosScalarFieldEnum = {
  photo_id: 'photo_id',
  orderNo: 'orderNo',
  s3_key: 's3_key',
  uploaded_at: 'uploaded_at'
};

exports.Prisma.OrdersScalarFieldEnum = {
  orderNo: 'orderNo',
  customer_id: 'customer_id',
  date: 'date',
  onote: 'onote'
};

exports.Prisma.ItemsScalarFieldEnum = {
  item_id: 'item_id',
  orderNo: 'orderNo',
  item_name: 'item_name',
  item_type: 'item_type',
  fabric_id: 'fabric_id',
  lining_fabric_id: 'lining_fabric_id',
  jacket_measurement_id: 'jacket_measurement_id',
  shirt_measurement_id: 'shirt_measurement_id',
  pant_measurement_id: 'pant_measurement_id',
  final_jacket_measurement_id: 'final_jacket_measurement_id',
  final_shirt_measurement_id: 'final_shirt_measurement_id',
  final_pant_measurement_id: 'final_pant_measurement_id'
};

exports.Prisma.SupplierScalarFieldEnum = {
  supplier_id: 'supplier_id',
  supplier_name: 'supplier_name',
  add1: 'add1',
  add2: 'add2',
  add3: 'add3',
  phone_number1: 'phone_number1',
  phone_number2: 'phone_number2',
  phone_number3: 'phone_number3',
  email: 'email',
  primary_contact_name1: 'primary_contact_name1',
  primary_contact_name2: 'primary_contact_name2',
  primary_contact_name3: 'primary_contact_name3',
  notes: 'notes'
};

exports.Prisma.TailorScalarFieldEnum = {
  tailor_id: 'tailor_id',
  first_name: 'first_name',
  last_name: 'last_name',
  specialization: 'specialization',
  experience_years: 'experience_years',
  joining_date: 'joining_date',
  address: 'address',
  phone_number: 'phone_number',
  email: 'email',
  emergency_contact: 'emergency_contact',
  status: 'status',
  hourly_rate: 'hourly_rate',
  notes: 'notes'
};

exports.Prisma.OrderTailorScalarFieldEnum = {
  id: 'id',
  orderNo: 'orderNo',
  tailor_id: 'tailor_id',
  assigned_at: 'assigned_at',
  status: 'status',
  due_date: 'due_date',
  notes: 'notes'
};

exports.Prisma.RawMaterialsOrderListScalarFieldEnum = {
  order_id: 'order_id',
  product_name: 'product_name',
  description: 'description',
  raw_material_code: 'raw_material_code',
  color: 'color',
  supplier_name: 'supplier_name',
  quantity: 'quantity',
  ordered_date: 'ordered_date',
  supplier_id: 'supplier_id'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LogEntryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  timestamp: 'timestamp'
};

exports.Prisma.OrderProductionScalarFieldEnum = {
  id: 'id',
  orderNo: 'orderNo',
  status: 'status',
  updatedAt: 'updatedAt',
  notes: 'notes'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.MovementType = exports.$Enums.MovementType = {
  IN: 'IN',
  OUT: 'OUT',
  TRANSFER: 'TRANSFER',
  ADJUSTMENT: 'ADJUSTMENT'
};

exports.InventoryItemType = exports.$Enums.InventoryItemType = {
  FABRIC: 'FABRIC',
  RAW_MATERIAL: 'RAW_MATERIAL',
  PACKAGING_MATERIAL: 'PACKAGING_MATERIAL'
};

exports.ItemType = exports.$Enums.ItemType = {
  SHIRT: 'SHIRT',
  JACKET: 'JACKET',
  PANT: 'PANT'
};

exports.Role = exports.$Enums.Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  FLOOR_MANAGER: 'FLOOR_MANAGER',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER'
};

exports.ProductionStatus = exports.$Enums.ProductionStatus = {
  PATTERN_CUTTING_PENDING: 'PATTERN_CUTTING_PENDING',
  TAILOR_ASSIGNMENT_PENDING: 'TAILOR_ASSIGNMENT_PENDING',
  BASE_SUIT_PRODUCTION: 'BASE_SUIT_PRODUCTION',
  TRIAL_PENDING: 'TRIAL_PENDING',
  FINAL_PRODUCTION: 'FINAL_PRODUCTION',
  FINAL_FITTING_PENDING: 'FINAL_FITTING_PENDING',
  DELIVERY_PENDING: 'DELIVERY_PENDING',
  DELIVERED: 'DELIVERED'
};

exports.Prisma.ModelName = {
  Location: 'Location',
  Rack: 'Rack',
  Bunch: 'Bunch',
  Unit: 'Unit',
  InventoryMovement: 'InventoryMovement',
  ItemSupplier: 'ItemSupplier',
  InventoryItem: 'InventoryItem',
  Customer: 'Customer',
  Fabric: 'Fabric',
  FabricOrderList: 'FabricOrderList',
  FinalJacketMeasurement: 'FinalJacketMeasurement',
  JacketMeasurement: 'JacketMeasurement',
  FinalPantMeasurement: 'FinalPantMeasurement',
  PantMeasurement: 'PantMeasurement',
  FinalShirtMeasurement: 'FinalShirtMeasurement',
  ShirtMeasurement: 'ShirtMeasurement',
  OrderPhotos: 'OrderPhotos',
  Orders: 'Orders',
  Items: 'Items',
  Supplier: 'Supplier',
  Tailor: 'Tailor',
  OrderTailor: 'OrderTailor',
  RawMaterialsOrderList: 'RawMaterialsOrderList',
  User: 'User',
  LogEntry: 'LogEntry',
  OrderProduction: 'OrderProduction'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
