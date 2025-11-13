import React, { useState } from 'react';
import { Plus, Trash2, FileText, BarChart3, Download, Wifi } from 'lucide-react';

export default function AssetManagementApp() {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Tech Corp', email: 'contact@techcorp.com', phone: '555-0101' },
    { id: 2, name: 'Finance Inc', email: 'contact@financeinc.com', phone: '555-0102' }
  ]);

  const [devices, setDevices] = useState([
    { id: 1, deviceName: 'Desktop-001', serialNumber: 'SN-001234', osType: 'Windows 11', deviceType: 'Desktop', userName: 'john.smith', ipAddress: '192.168.1.10', customerId: 1, status: 'deployed', manufacturer: 'Dell', model: 'OptiPlex 7090' },
    { id: 2, deviceName: 'Laptop-002', serialNumber: 'SN-005678', osType: 'macOS 13', deviceType: 'Laptop', userName: 'jane.doe', ipAddress: '192.168.1.20', customerId: 1, status: 'deployed', manufacturer: 'Apple', model: 'MacBook Pro' }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedDevices, setScannedDevices] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [newDevice, setNewDevice] = useState({ deviceName: '', serialNumber: '', osType: '', deviceType: '', userName: '', ipAddress: '', customerId: '', status: 'stock', manufacturer: '', model: '' });

  const addCustomer = () => {
    if (newCustomer.name.trim()) {
      setCustomers([...customers, { id: Math.max(...customers.map(c => c.id), 0) + 1, ...newCustomer }]);
      setNewCustomer({ name: '', email: '', phone: '' });
      setShowAddCustomer(false);
    }
  };

  const addDevice = () => {
    if (newDevice.deviceName.trim() && newDevice.customerId) {
      setDevices([...devices, { id: Math.max(...devices.map(d => d.id), 0) + 1, ...newDevice }]);
      setNewDevice({ deviceName: '', serialNumber: '', osType: '', deviceType: '', userName: '', ipAddress: '', customerId: '', status: 'stock', manufacturer: '', model: '' });
      setShowAddDevice(false);
    }
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    setDevices(devices.filter(d => d.customerId !== id));
  };

  const deleteDevice = (id) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === parseInt(customerId));
    return customer ? customer.name : 'Unknown';
  };

  const totalDevices = devices.length;
  const totalCustomers = customers.length;
  const devicesDeployed = devices.filter(d => d.status === 'deployed').length;
  const devicesStock = devices.filter(d => d.status === 'stock').length;

  const devicesByType = devices.reduce((acc, d) => {
    acc[d.deviceType] = (acc[d.deviceType] || 0) + 1;
    return acc;
  }, {});

  const osByType = devices.reduce((acc, d) => {
    acc[d.osType] = (acc[d.osType] || 0) + 1;
    return acc;
  }, {});

  const simulateNetworkScan = async () => {
    setScanning(true);
    setScanProgress(0);
    setScannedDevices([]);

    const mockDevices = [
      { ip: '192.168.1.5', deviceName: 'Firewall-Main', serialNumber: 'FW-2024-001', osType: 'Cisco IOS', deviceType: 'Firewall', userName: 'admin', manufacturer: 'Cisco', model: 'ASA5506-X' },
      { ip: '192.168.1.10', deviceName: 'Printer-Office', serialNumber: 'PR-HP-2024', osType: 'Linux', deviceType: 'Printer', userName: 'print_admin', manufacturer: 'HP', model: 'LaserJet Pro M404n' },
      { ip: '192.168.1.15', deviceName: 'Switch-Core', serialNumber: 'SW-CORE-001', osType: 'Catalyst OS', deviceType: 'Network Switch', userName: 'network_admin', manufacturer: 'Cisco', model: 'Catalyst 3850' },
      { ip: '192.168.1.25', deviceName: 'Desktop-Sales', serialNumber: 'SN-DELL-2024', osType: 'Windows 11 Pro', deviceType: 'Desktop', userName: 'sales_user', manufacturer: 'Dell', model: 'Optiplex 7950' }
    ];

    for (let i = 0; i < mockDevices.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setScanProgress(Math.round((i / mockDevices.length) * 100));
      setScannedDevices(prev => [...prev, mockDevices[i]]);
    }
    setScanProgress(100);
    setScanning(false);
  };

  const addScannedDeviceToInventory = (scannedDevice) => {
    const newId = Math.max(...devices.map(d => d.id), 0) + 1;
    setDevices([...devices, {
      id: newId,
      deviceName: scannedDevice.deviceName,
      serialNumber: scannedDevice.serialNumber,
      osType: scannedDevice.osType,
      deviceType: scannedDevice.deviceType,
      userName: scannedDevice.userName,
      ipAddress: scannedDevice.ip,
      customerId: 1,
      status: 'deployed',
      manufacturer: scannedDevice.manufacturer,
      model: scannedDevice.model
    }]);
  };

  const exportToJSON = () => {
    const data = { customers, devices, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset-inventory-${Date.now()}.json`;
    a.click();
  };

  const exportToCSV = () => {
    let csv = 'Customer,Device,Serial,Manufacturer,Model,OS,Type,User,IP,Status\n';
    devices.forEach(device => {
      const customer = getCustomerName(device.customerId);
      csv += `"${customer}","${device.deviceName}","${device.serialNumber}","${device.manufacturer}","${device.model}","${device.osType}","${device.deviceType}","${device.userName}","${device.ipAddress}","${device.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset-inventory-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Asset Management System</h1>
          <p className="text-gray-600">Network scanning + Asset tracking</p>
        </div>

        <div className="flex gap-4 mb-8 flex-wrap">
          <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-3 rounded-lg font-medium ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('customers')} className={`px-6 py-3 rounded-lg font-medium ${activeTab === 'customers' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            Customers
          </button>
          <button onClick={() => setActiveTab('devices')} className={`px-6 py-3 rounded-lg font-medium ${activeTab === 'devices' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            Devices
          </button>
          <button onClick={() => setActiveTab('network')} className={`px-6 py-3 rounded-lg font-medium ${activeTab === 'network' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            Network Scan
          </button>
          <button onClick={() => setActiveTab('reports')} className={`px-6 py-3 rounded-lg font-medium ${activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            Reports
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600">Total Devices</p>
                <p className="text-3xl font-bold text-indigo-600">{totalDevices}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600">Deployed</p>
                <p className="text-3xl font-bold text-blue-600">{devicesDeployed}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600">Stock</p>
                <p className="text-3xl font-bold text-purple-600">{devicesStock}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-gray-600">Customers</p>
                <p className="text-3xl font-bold text-green-600">{totalCustomers}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-4">By Type</h3>
                {Object.entries(devicesByType).map(([type, count]) => (
                  <div key={type} className="flex justify-between p-2 bg-gray-50 mb-2 rounded">
                    <span>{type}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-bold text-gray-800 mb-4">By OS</h3>
                {Object.entries(osByType).map(([os, count]) => (
                  <div key={os} className="flex justify-between p-2 bg-gray-50 mb-2 rounded">
                    <span className="text-sm">{os}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <button onClick={() => setShowAddCustomer(!showAddCustomer)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
              <Plus className="inline mr-2" size={20} /> Add Customer
            </button>

            {showAddCustomer && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <input type="text" placeholder="Name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} className="w-full mb-3 p-2 border rounded" />
                <input type="email" placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} className="w-full mb-3 p-2 border rounded" />
                <input type="tel" placeholder="Phone" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} className="w-full mb-3 p-2 border rounded" />
                <div className="flex gap-2">
                  <button onClick={addCustomer} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setShowAddCustomer(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map(customer => {
                const deployed = devices.filter(d => d.customerId === customer.id && d.status === 'deployed').length;
                const stock = devices.filter(d => d.customerId === customer.id && d.status === 'stock').length;
                return (
                  <div key={customer.id} className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{customer.name}</h3>
                      <button onClick={() => deleteCustomer(customer.id)} className="text-red-600"><Trash2 size={20} /></button>
                    </div>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{customer.phone}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-blue-50 p-2 rounded">
                        <p className="text-xs">Deployed</p>
                        <p className="font-bold text-blue-600">{deployed}</p>
                      </div>
                      <div className="text-center bg-purple-50 p-2 rounded">
                        <p className="text-xs">Stock</p>
                        <p className="font-bold text-purple-600">{stock}</p>
                      </div>
                      <div className="text-center bg-indigo-50 p-2 rounded">
                        <p className="text-xs">Total</p>
                        <p className="font-bold">{deployed + stock}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="space-y-6">
            <button onClick={() => setShowAddDevice(!showAddDevice)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
              <Plus className="inline mr-2" size={20} /> Add Device
            </button>

            {showAddDevice && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input type="text" placeholder="Device Name" value={newDevice.deviceName} onChange={(e) => setNewDevice({ ...newDevice, deviceName: e.target.value })} className="p-2 border rounded" />
                  <input type="text" placeholder="Serial" value={newDevice.serialNumber} onChange={(e) => setNewDevice({ ...newDevice, serialNumber: e.target.value })} className="p-2 border rounded" />
                  <input type="text" placeholder="Manufacturer" value={newDevice.manufacturer} onChange={(e) => setNewDevice({ ...newDevice, manufacturer: e.target.value })} className="p-2 border rounded" />
                  <input type="text" placeholder="Model" value={newDevice.model} onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })} className="p-2 border rounded" />
                  <input type="text" placeholder="OS" value={newDevice.osType} onChange={(e) => setNewDevice({ ...newDevice, osType: e.target.value })} className="p-2 border rounded" />
                  <input type="text" placeholder="Type" value={newDevice.deviceType} onChange={(e) => setNewDevice({ ...newDevice, deviceType: e.target.value })} className="p-2 border rounded" />
                  <input type="text" placeholder="User" value={newDevice.userName} onChange={(e) => setNewDevice({ ...newDevice, userName: e.target.value })} className="p-2 border rounded" />
                  <input type="text" placeholder="IP" value={newDevice.ipAddress} onChange={(e) => setNewDevice({ ...newDevice, ipAddress: e.target.value })} className="p-2 border rounded" />
                </div>
                <select value={newDevice.customerId} onChange={(e) => setNewDevice({ ...newDevice, customerId: e.target.value })} className="w-full p-2 border rounded mb-3">
                  <option>Select Customer</option>
                  {customers.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
                <div className="flex gap-2">
                  <button onClick={addDevice} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setShowAddDevice(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <button onClick={() => setDeviceFilter('all')} className={`px-4 py-2 rounded ${deviceFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white'}`}>All ({totalDevices})</button>
              <button onClick={() => setDeviceFilter('deployed')} className={`px-4 py-2 rounded ${deviceFilter === 'deployed' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Deployed ({devicesDeployed})</button>
              <button onClick={() => setDeviceFilter('stock')} className={`px-4 py-2 rounded ${deviceFilter === 'stock' ? 'bg-purple-600 text-white' : 'bg-white'}`}>Stock ({devicesStock})</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-md text-sm">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">Device</th>
                    <th className="px-3 py-2 text-left">Serial</th>
                    <th className="px-3 py-2 text-left">Mfg</th>
                    <th className="px-3 py-2 text-left">Model</th>
                    <th className="px-3 py-2 text-left">OS</th>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">User</th>
                    <th className="px-3 py-2 text-left">IP</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {devices.filter(d => deviceFilter === 'all' || d.status === deviceFilter).map(device => (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{device.deviceName}</td>
                      <td className="px-3 py-2">{device.serialNumber}</td>
                      <td className="px-3 py-2">{device.manufacturer}</td>
                      <td className="px-3 py-2">{device.model}</td>
                      <td className="px-3 py-2">{device.osType}</td>
                      <td className="px-3 py-2">{device.deviceType}</td>
                      <td className="px-3 py-2">{device.userName}</td>
                      <td className="px-3 py-2 font-mono text-xs">{device.ipAddress}</td>
                      <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-white text-xs ${device.status === 'deployed' ? 'bg-blue-600' : 'bg-purple-600'}`}>{device.status}</span></td>
                      <td className="px-3 py-2"><button onClick={() => deleteDevice(device.id)} className="text-red-600"><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Network Scanner</h2>
              <p className="text-gray-600 mb-4">Scan network for computers, printers, switches, servers, firewalls</p>
              
              <button onClick={simulateNetworkScan} disabled={scanning} className={`px-6 py-3 rounded-lg font-medium text-white ${scanning ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                <Wifi className="inline mr-2" size={20} /> {scanning ? 'Scanning...' : 'Start Scan'}
              </button>

              {scanning && (
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                  <p className="text-center mt-2">{scanProgress}%</p>
                </div>
              )}

              {scannedDevices.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold mb-4">Found {scannedDevices.length} Devices</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-gray-50 text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-3 py-2 text-left">Device</th>
                          <th className="px-3 py-2 text-left">IP</th>
                          <th className="px-3 py-2 text-left">Serial</th>
                          <th className="px-3 py-2 text-left">Mfg</th>
                          <th className="px-3 py-2 text-left">Model</th>
                          <th className="px-3 py-2 text-left">OS</th>
                          <th className="px-3 py-2 text-left">Type</th>
                          <th className="px-3 py-2">Add</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {scannedDevices.map((device, idx) => (
                          <tr key={idx} className="hover:bg-gray-100">
                            <td className="px-3 py-2">{device.deviceName}</td>
                            <td className="px-3 py-2 font-mono">{device.ip}</td>
                            <td className="px-3 py-2">{device.serialNumber}</td>
                            <td className="px-3 py-2">{device.manufacturer}</td>
                            <td className="px-3 py-2">{device.model}</td>
                            <td className="px-3 py-2">{device.osType}</td>
                            <td className="px-3 py-2">{device.deviceType}</td>
                            <td className="px-3 py-2"><button onClick={() => addScannedDeviceToInventory(device)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Add</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={exportToJSON} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                <Download className="inline mr-2" size={20} /> JSON
              </button>
              <button onClick={exportToCSV} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                <Download className="inline mr-2" size={20} /> CSV
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-indigo-50 rounded">
                  <p className="text-sm">Customers</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded">
                  <p className="text-sm">Total</p>
                  <p className="text-2xl font-bold">{totalDevices}</p>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <p className="text-sm">Deployed</p>
                  <p className="text-2xl font-bold">{devicesDeployed}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded">
                  <p className="text-sm">Stock</p>
                  <p className="text-2xl font-bold">{devicesStock}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}