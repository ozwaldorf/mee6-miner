![image](https://user-images.githubusercontent.com/8976745/206657502-5eb18e27-5684-4173-856e-acf2590dc321.png)

Mine mee6 coins with this advanced first class miner. The code works using a simple javascript puppeteer automation script.

## Strategy

Every 1 hr + random(0-5 min):

- work
- dice roll 50 coins

The idea is that work always gaurantees at least 100-300 coins, and the dice roll is a bonus.

- Worst case scenario, you lose 50 coins, but net 50-250 overall
- Middle case scenario, you win 50 coins, and net 150-350 overall
- Best case scenario, you win doubles at 100 coins, and net 200-400 overall


## Usage

1. Clone the repo

```
git clone https://github.com/ozwaldorf/mee6-miner
```

2. Install dependencies

```
npm install
```

3. Edit configuration

Rename `config.example.json` to `config.json`, and fill in the values

4. Login to your discord account

```
npm run login
```

5. Run the autoworker

```
npm start
```

Optionally, you can specify an initial delay with:
  
``` 
npm start 15
```

6. Profit
