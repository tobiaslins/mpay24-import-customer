# CLI for importing profiles to mPAY24

This is a command line interface for mPAY24 that will allow you to import your existing creditcard profiles to the mPAY24 system.

![Demo](https://media.giphy.com/media/26n6xVcLjwcQLQXdu/giphy.gif)

## Usage

Download the binary then run

Get help
```bash
./mpay24-import-customer -h
```

Example
```bash
./mpay24-import-customer -t -u 99999 -p password example.csv
```

## CSV

The CSV should contain three columns (customerid, identifier and expiry)
The first line is important for the program to run

`customerid` should be a unique string (reference of the customer)
`identifier` is the 16-19 digit creditcard number
`expiry` is the expiry date of the card in format YYMM

### Example

```csv
customerid;identifier;expiry
jones;4444333322221111;2001
mc;5555444433331111;2001
```
