# Homebridge Doorbell plugin

homebridge-doorbell

## Installation

```
npm install -g bodav/homebridge-doorbell
```

## Homebridge Config.json

```
"accessories" : [
    
    {
        "accessory": "doorbell",
        "name": "Front door",
        "pin": 7,
        "reset": 4500,
    }
]    
```

| Key           | Description                                                                |
|---------------|----------------------------------------------------------------------------|
| accessory     | Required. Must be "doorbell"                                               |
| name          | Required. The name of this accessory.                                      |
| pin           | Required. The GPIO pin which will be raised when the doorbell is activated |
| reset         | Optional. Event reset timeout in ms. Default: 4500                         |
