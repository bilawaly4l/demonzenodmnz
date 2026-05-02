import Types "../types/academy";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Array "mo:core/Array";
import List "mo:core/List";

module {

  // ── Helpers ───────────────────────────────────────────────────────────────

  // q helper: creates a QuizQuestion with no review flag (default false)
  func q(
    id : Text,
    question : Text,
    a : Text, b : Text, c : Text, d : Text,
    correct : Text,
    explanation : Text,
  ) : Types.QuizQuestion {
    {
      id;
      question;
      options = [
        { id = "a"; text = a },
        { id = "b"; text = b },
        { id = "c"; text = c },
        { id = "d"; text = d },
      ];
      correctOption = correct;
      explanation;
      isReviewFlagged = false;
    };
  };

  // ── Tier: Beginner ────────────────────────────────────────────────────────

  func beginnerQuestions() : [Types.QuizQuestion] { [
    q("b01","What is trading?","Buying goods at a physical market","Exchanging financial instruments to profit from price changes","Saving money in a bank account","Donating assets to charity","b","Trading involves buying and selling financial instruments — stocks, crypto, forex — aiming to profit from price movements."),
    q("b02","Which of the following is NOT a common asset class in trading?","Stocks","Cryptocurrency","Forex currency pairs","Household furniture","d","The main tradeable asset classes are stocks (equities), cryptocurrencies, and forex currency pairs. Furniture is not a financial asset."),
    q("b03","How does a centralised exchange (CEX) work?","It lets traders swap assets directly on a blockchain","It acts as an intermediary matching buy and sell orders from users","It only allows institutional traders","It operates without any order books","b","A CEX (like Binance) matches buyers and sellers through an order book, acting as the middleman for all trades."),
    q("b04","What is the bid price?","The price a seller demands","The highest price a buyer is willing to pay for an asset","The last traded price","The mid-market price","b","The bid is the maximum price a buyer is prepared to pay — always lower than the ask price."),
    q("b05","What is the ask price?","The price a buyer offers","The lowest price a seller will accept for an asset","The average daily price","The price at market open","b","The ask is the minimum price a seller will accept — always higher than the bid, creating the bid-ask spread."),
    q("b06","What is the bid-ask spread?","The daily price range","The difference between bid and ask price","Commission charged by a broker","The gap between high and low of a candle","b","The spread is the difference between what buyers will pay and sellers will accept — it represents the broker's implicit profit."),
    q("b07","What is a market order?","An order placed at a specific price","An order to buy or sell immediately at the best available current price","An order that stays open for 30 days","A conditional order triggered at a set price","b","A market order executes instantly at whatever the current market price is — you prioritise speed over price precision."),
    q("b08","What is a limit order?","An order that executes at current price","An order to buy or sell at a specific pre-set price or better","An automatic stop loss","An order placed during off-hours","b","A limit order only fills at your specified price or better — useful when you want to enter or exit at a precise level."),
    q("b09","What is a stop order (stop loss)?","An order to buy at the market price","An order that triggers a market order once a specified price is reached","A limit order set above current price","An order that never expires","b","A stop order sits at a trigger price — once hit, it becomes a market order, limiting your loss on an adverse move."),
    q("b10","What does a candlestick represent?","A single price point in time","Open, high, low, and close price for a specific time period","Only the closing price","A multi-day average price","b","Each candlestick shows four key prices for a period: the open, the high, the low, and the close — all the essential price action information."),
    q("b11","What does a green (bullish) candlestick body indicate?","The close was below the open","The close was above the open — price rose in that period","No price change occurred","High trading volume","b","A green candle body shows the closing price was higher than the opening price — buyers dominated that time period."),
    q("b12","What is a bull market?","A market falling 20% or more","A sustained period of rising prices and investor optimism","A market with high volatility only","A sideways market","b","A bull market is a prolonged period of rising asset prices — typically defined as a 20% or more gain from recent lows."),
    q("b13","What is a bear market?","Prices are rising strongly","A sustained decline of 20% or more from recent highs","Only cryptocurrency markets declining","A market with very low volume","b","A bear market is a decline of 20%+ from recent highs sustained over time — reflecting widespread pessimism and selling."),
    q("b14","What is a support level?","A price where sellers overwhelm buyers","A price level where buying demand historically stops price from falling further","A moving average line","A resistance zone","b","Support is a price floor — buyers have historically stepped in at this level, preventing further decline."),
    q("b15","What is a resistance level?","A price where buying pressure dominates","A price level where selling pressure historically stops price from rising further","A support turned upside down","The all-time high only","b","Resistance is a price ceiling — sellers have historically emerged at this level, capping upward price movement."),
    q("b16","What does leverage mean in trading?","Using only your own funds","Borrowing capital to control a position larger than your account balance","A type of order","A risk indicator","b","Leverage amplifies your purchasing power — 10x leverage means you control $10,000 with $1,000 — magnifying both gains and losses."),
    q("b17","What is margin?","Your total account balance","The collateral deposit required to open and maintain a leveraged position","A trading fee","The mid price between bid and ask","b","Margin is the security deposit needed for a leveraged trade — if the market moves against you, you may face a margin call."),
    q("b18","What is the basic 2% risk management rule?","Always use 2x leverage","Never risk more than 2% of your total trading account on a single trade","Only trade assets that move 2% per day","Keep 2% of trades open at all times","b","The 2% rule protects capital — risking 2% per trade means 50 consecutive losses to wipe out your account, giving you time to improve."),
    q("b19","What is a trading pair?","Two brokers trading together","Two assets quoted against each other, e.g. BTC/USDT or EUR/USD","Two traders on opposite sides of a trade","Two candlesticks next to each other","b","A trading pair shows the price of one asset relative to another — BTC/USDT tells you how many USDT one BTC costs."),
    q("b20","What does 'going long' mean?","Holding a trade for a long time","Buying an asset expecting its price to rise","Selling borrowed assets","Placing a limit order","b","Going long means buying an asset with the expectation that its price will increase so you can sell higher later."),
    q("b21","What does 'going short' mean?","Holding a position overnight","Selling borrowed assets expecting the price to fall, then buying back cheaper","Placing a very small trade","A quick scalp trade","b","Going short profits from price declines — you borrow and sell high, then buy back lower to return the asset and keep the difference."),
    q("b22","What is a pip in forex?","A price indicator pattern","The smallest standard price movement unit in a forex currency pair (usually 0.0001)","A percentage of profit","A type of order","b","A pip (percentage in point) is the standard smallest move in forex — for EUR/USD moving from 1.1050 to 1.1051 is one pip."),
    q("b23","What are common trading timeframes?","Only 1-hour and 1-day","1-minute, 5-minute, 15-minute, 1-hour, 4-hour, 1-day, and 1-week","Annual charts only","Tick charts only","b","Timeframes range from 1-minute (scalping) to weekly (long-term investing) — traders use multiple timeframes to confirm setups."),
    q("b24","What is the DemonZeno signal format?","Entry and Stop Loss only","Entry, Stop Loss (SL), Take Profit 1 (TP1), Take Profit 2 (TP2), and Take Profit 3 (TP3)","Entry and three targets only","Only one take profit level","b","Every DemonZeno signal provides Entry price, Stop Loss (SL), and three Take Profit levels (TP1/TP2/TP3) for a complete trade plan."),
    q("b25","What is a stop loss (SL)?","A target profit price","A pre-set price where your trade closes automatically to limit losses","The opening price of a trade","A moving average","b","A stop loss exits your trade at a defined level if price moves against you — it is your ultimate risk protection."),
    q("b26","What is take profit (TP)?","A type of order entry","A pre-set price where your trade closes automatically to lock in gains","The break-even price","A stop loss level","b","Take profit automatically closes your trade when it reaches your target price — ensuring you capture gains before reversal."),
    q("b27","What is an emotional trading pitfall?","Following a trading plan strictly","Making impulsive trade decisions based on fear or greed rather than your strategy","Using a stop loss on every trade","Keeping a trading journal","b","Emotional trading — chasing losses, over-trading after wins, or holding losers from hope — destroys accounts over time."),
    q("b28","What is FOMO in trading?","A trading strategy","Fear Of Missing Out — entering a trade impulsively because price is moving fast without a proper setup","A type of stop loss","A chart pattern","b","FOMO causes traders to buy tops or enter without a proper setup — one of the most destructive emotional trading mistakes."),
    q("b29","What is a trading plan?","A broker's fee schedule","A personal rulebook defining your strategy, entry/exit rules, risk limits, and trading schedule","A price chart","A signal subscription service","b","A trading plan removes emotion from decisions — every trade is entered, managed, and closed according to pre-defined rules."),
    q("b30","What does DemonZeno provide free on Binance Square?","Paid signals","Free daily trading signals with Entry, SL, TP1, TP2, and TP3 for Binance markets","Portfolio management advice","Crypto news only","b","DemonZeno posts free daily trading signals on Binance Square @DemonZeno — every signal includes a complete trade plan with Entry, SL, and three TP levels."),
    q("b31","What does 'liquidity' mean in trading?","The speed of price movement","The ease with which an asset can be bought or sold without significantly affecting its price","The total supply of an asset","The volatility of a market","b","High liquidity means you can enter and exit a position quickly at a fair price — low liquidity means large bid-ask spreads and slippage."),
    q("b32","What is slippage?","A trading mistake","The difference between the expected execution price and the actual fill price","A type of commission","A chart gap","b","Slippage occurs when market orders fill at a different price than expected — more common in volatile or illiquid markets."),
    q("b33","What is a portfolio in trading?","A single trade","The total collection of financial assets and positions held by a trader or investor","A type of order book","A broker account","b","A trading portfolio is all your combined holdings — diversifying across assets can reduce overall risk from any single position."),
    q("b34","What is the difference between investing and trading?","There is no difference","Investing is long-term wealth building; trading is shorter-term buying and selling to profit from price moves","Trading means using leverage; investing does not","Investing is only for stocks","b","Investors hold assets for months or years; traders hold for seconds to weeks. Trading requires more active management and risk control."),
    q("b35","What is a breakeven trade?","A winning trade","A trade that closes at exactly zero profit or loss — neither gained nor lost","A losing trade","A trade with no stop loss","b","Moving your stop loss to the entry price turns a trade breakeven — it locks out a loss while giving the trade room to hit targets."),
    q("b36","What does 'pips gained' measure in forex?","Total profit in dollars","The number of pip movements captured in a trade","Number of trades","Account growth percentage","b","Pips gained is the raw movement captured — 50 pips gained on EUR/USD at standard lot = $500. Converting pips to dollars depends on lot size."),
    q("b37","What is a lot size in forex?","A type of trading signal","A standardised unit of currency volume in forex trading — standard lot = 100,000 units, mini = 10,000, micro = 1,000","A time interval on a chart","A trading account type","b","Lot sizes standardise trade volumes in forex — standard lot gives $10/pip on most pairs, mini lot $1/pip, micro lot $0.10/pip."),
    q("b38","What is a cryptocurrency wallet?","A mobile app for tracking prices","Software or hardware that stores private keys allowing access to your cryptocurrency holdings","A trading account on an exchange","A type of crypto trading pair","b","A crypto wallet doesn't 'store' coins — it stores private keys that prove ownership on the blockchain. Never share your private key with anyone."),
    q("b39","What is a blockchain?","A type of database for banks only","A decentralised, immutable distributed ledger recording all transactions across a network of computers","A crypto exchange","A trading algorithm","b","A blockchain is a chain of transaction blocks — each block references the previous, making it tamper-resistant and transparent without central authority."),
    q("b40","What is DeFi?","A centralised finance system","Decentralised Finance — financial services built on blockchain smart contracts without intermediaries like banks","A type of crypto exchange","A trading strategy","b","DeFi protocols (Uniswap, Aave, Compound) allow lending, borrowing, and trading directly on blockchain — no central authority, no KYC required."),
    q("b41","What is a crypto whale?","A large fish","An entity holding enough cryptocurrency to significantly influence market prices through large buy or sell orders","A type of market indicator","A trading strategy","b","Crypto whales — large holders — can move markets with single transactions. Watching whale wallet movements is a form of on-chain analysis."),
    q("b42","What is FUD in crypto trading?","A bullish signal","Fear, Uncertainty, and Doubt — negative news or sentiment spread to cause panic selling","A technical pattern","A type of order","b","FUD (Fear, Uncertainty, Doubt) is often deliberately spread to drive down prices so whales can accumulate cheaper — a common crypto market manipulation tactic."),
    q("b43","What is HODL in crypto?","A trading term for short selling","Hold On for Dear Life — a long-term strategy of holding crypto regardless of price fluctuations","A quick profit strategy","A leverage trading technique","b","HODL originated from a typo in a 2013 Bitcoin forum post — it became the philosophy of holding through volatility rather than trading. It's a valid long-term approach."),
    q("b44","What is the difference between spot and futures trading?","No difference","Spot = buying/owning actual assets now; Futures = contracts agreeing to buy/sell at a future date, often leveraged","Spot requires leverage; futures do not","Futures only exist for stocks","b","Spot trading is straightforward ownership — buy now, own now. Futures trading involves contracts (often leveraged) to buy/sell at a future price, with higher risk."),
    q("b45","What is market capitalisation in crypto?","Daily trading volume","Total market value = current price × circulating supply","Exchange volume only","Total coins ever mined","b","Market cap = price × circulating supply. It gives context for an asset's relative size — BTC has a much larger market cap than most altcoins."),
  ] };

  // ── Tier: Intermediate ────────────────────────────────────────────────────

  func intermediateQuestions() : [Types.QuizQuestion] { [
    q("i01","What is a Doji candlestick?","A large bullish candle","A candle where open and close are nearly equal — indicating indecision in the market","A bearish engulfing pattern","A gap between two candles","b","A Doji has a tiny body (open ≈ close) with wicks above and below — price went up and down but returned to start, showing indecision."),
    q("i02","What is a hammer candlestick?","A large bearish candle","A small body at the top with a long lower wick — bullish reversal signal after a downtrend","A candle with equal wicks","A bearish pin bar","b","A hammer has a small body near the top and a long lower wick — buyers rejected lower prices, signalling potential reversal."),
    q("i03","What is a bearish engulfing pattern?","A bullish continuation signal","A two-candle reversal pattern where a large red candle completely engulfs the previous green candle","A double top pattern","A Doji at resistance","b","Bearish engulfing: the second (red) candle's body completely covers the first (green) candle's body — strong reversal signal at tops."),
    q("i04","What is a morning star pattern?","A single bullish candle","A three-candle bullish reversal: large red, small indecision candle, then large green candle","A bearish reversal pattern","A continuation pattern","b","Morning star is a three-candle bullish reversal — red candle, then a Doji/small candle gap, then strong green candle — signalling bottom."),
    q("i05","How do you draw a trend line?","Connect any two random points","Connect at least two swing highs (downtrend) or two swing lows (uptrend)","Connect the open and close of candles","Draw a horizontal line at the average price","b","An uptrend line connects swing lows; a downtrend line connects swing highs — the more touches, the more significant the line."),
    q("i06","What is a price channel?","A single trend line","Two parallel trend lines capturing price action — an upper resistance line and a lower support line","A type of moving average","A Bollinger Band","b","A channel is drawn with two parallel lines — one connecting highs, one connecting lows — price bounces between them in a trending market."),
    q("i07","What does RSI stand for?","Rate of Systematic Investment","Relative Strength Index — a momentum oscillator ranging from 0 to 100","Resistance Support Indicator","Relative Signal Intelligence","b","RSI (Relative Strength Index) measures the speed and magnitude of price changes — it oscillates between 0 and 100."),
    q("i08","RSI above 70 typically signals?","Strong buy","Overbought — price may be due for a pullback or reversal","Oversold","Neutral momentum","b","RSI above 70 means the asset has been bought aggressively and may be overextended — a potential sell signal or caution zone."),
    q("i09","RSI below 30 typically signals?","Overbought market","Strong sell","Oversold — potential buy opportunity or reversal","Neutral market condition","c","RSI below 30 means the asset has been sold heavily and may be undervalued — a potential buy signal or bounce zone."),
    q("i10","What does MACD stand for?","Market Analysis Chart Display","Moving Average Convergence Divergence — a trend-following momentum indicator","Momentum Average Comparison Data","Moving Accumulation Convergence Direction","b","MACD uses two exponential moving averages to show momentum — when MACD crosses the signal line, it generates buy or sell signals."),
    q("i11","What is a bullish MACD crossover?","MACD line drops below signal line","MACD line crosses above the signal line — a buy signal","Both lines cross zero","Histogram turns negative","b","When the MACD line crosses above the signal line, it signals rising momentum — a common bullish entry trigger."),
    q("i12","What are Bollinger Bands?","Two moving averages","A middle moving average with upper and lower bands set at two standard deviations from it","Three RSI levels","A volume indicator","b","Bollinger Bands consist of a 20-period SMA with bands ±2 standard deviations — price touching the upper band is overbought; lower is oversold."),
    q("i13","What does a Bollinger Band squeeze indicate?","High volatility is current","Low volatility consolidation — a breakout (either direction) is likely imminent","The trend is ending","The bands are incorrect","b","When Bollinger Bands contract (squeeze), it signals historically low volatility — these periods often precede significant breakouts."),
    q("i14","What is volume analysis in trading?","The total number of trades open","Studying trading volume to confirm price moves — high volume confirms breakouts; low volume raises doubts","The market capitalisation of an asset","A moving average approach","b","Volume confirms price action — a breakout on high volume is much more reliable than the same move on thin volume."),
    q("i15","What is a support-resistance flip?","Support and resistance merging","When a broken support level becomes new resistance (or broken resistance becomes new support)","When price returns to its open","A false breakout pattern","b","Once a support level is broken, it often becomes a new resistance zone — and vice versa. This flip is a key concept in technical analysis."),
    q("i16","What is a breakout trade?","Entering inside a consolidation range","Entering a trade when price breaks decisively above resistance or below support","Buying near a moving average","A reversal trade at a pattern","b","A breakout trade enters when price moves beyond a key level — ideally with increased volume to confirm the move is genuine."),
    q("i17","What is consolidation?","A strong trending phase","A period where price moves sideways in a narrow range between support and resistance","A bearish trend","A gap in price action","b","Consolidation is sideways price action — the market is building energy before its next move. Breakouts from consolidation can be powerful."),
    q("i18","What is the difference between SMA and EMA?","No practical difference","SMA treats all periods equally; EMA gives more weight to recent prices making it faster to react","SMA is faster than EMA","EMA only uses the last 10 candles","b","EMA reacts faster to recent price changes than SMA because it weights recent data more heavily — useful in fast-moving markets."),
    q("i19","What is a golden cross?","Any two moving averages crossing","The 50-period MA crossing above the 200-period MA — a long-term bullish signal","RSI crossing the 50 level","Price breaking above its EMA","b","A golden cross (50 MA above 200 MA) is one of the most widely watched long-term bullish signals across stocks and crypto."),
    q("i20","What is divergence in technical analysis?","Price and indicator moving together","When price makes a new high/low but the indicator (RSI/MACD) fails to confirm it — signalling weakening momentum","A chart pattern","Two lines crossing on a chart","b","Divergence warns that the current price trend is losing momentum — it often precedes a reversal when combined with other signals."),
    q("i21","What is the risk-reward ratio?","The ratio of wins to losses","The ratio of potential profit to potential loss on a single trade","Win rate percentage","Your account size versus position size","b","Risk-reward compares how much you stand to gain versus lose — a 1:3 ratio means risking $1 to potentially earn $3."),
    q("i22","What is a good minimum risk-reward ratio?","0.5:1 (lose more than you gain)","1:1 (equal risk and reward)","1:2 or better (profit potential at least 2x the risk)","5:1 (only take very safe trades)","c","Most professional traders aim for at least 1:2 — risking $1 to make $2. This means you can be wrong 40% of the time and still profit."),
    q("i23","What is position sizing?","The number of different assets in a portfolio","Calculating exactly how much capital to put into a single trade based on risk percentage and stop loss distance","The leverage multiplier used","The number of open trades","b","Position sizing determines how many units to trade so that if your stop loss is hit, you lose exactly your pre-defined risk amount (e.g. 1-2%)."),
    q("i24","What is a swing trade?","Holding a position for seconds","Holding a position for several days to weeks to capture a medium-term price swing","An intraday scalp","A position held for years","b","Swing trading captures moves over days to weeks — longer than day trading but shorter than investing. Ideal for part-time traders."),
    q("i25","What is scalping?","A long-term trading strategy","Very short-term trading targeting many small profits — positions held for seconds to minutes","Weekly trend following","Holding through earnings events","b","Scalping makes many rapid trades for tiny profits each — requires full attention, fast execution, and tight spreads to be profitable."),
    q("i26","What is a trend reversal?","Price continuing in the same direction","A change in the overall direction of price — an uptrend turning into a downtrend or vice versa","A temporary pullback within a trend","A false breakout pattern","b","A trend reversal marks the end of one directional move and the beginning of a new opposing trend — confirmed by new structure."),
    q("i27","What is multi-timeframe analysis?","Trading the same timeframe always","Analysing a higher timeframe for bias and direction, then using a lower timeframe for precise entry","Comparing two assets' charts","Using two indicators simultaneously","b","Multi-timeframe analysis uses a higher TF (e.g. 4H) for directional bias and a lower TF (e.g. 15M) for a precise, low-risk entry."),
    q("i28","How do you read a DemonZeno signal correctly?","Only look at the entry price","Identify Entry for where to open, SL for max risk, TP1/TP2/TP3 as sequential profit targets","Ignore the stop loss","Only target TP3 directly","b","Reading a DemonZeno signal: enter at Entry, protect capital with SL, and take partial or full profits at TP1, TP2, and TP3 as price rises."),
    q("i29","What is confluence in trading?","Using two brokers simultaneously","Multiple independent technical signals aligning in the same direction — increases setup quality","Trading two assets at once","A type of chart pattern","b","Confluence means several factors agree — e.g. key support + RSI oversold + bullish divergence + bullish candlestick pattern. More factors = higher probability."),
    q("i30","What is the purpose of a trading journal?","To record daily news","To track all trades including entry, exit, reasoning, and result — enabling continuous improvement","A broker account statement","A signal log","b","A trading journal is your most powerful improvement tool — it reveals patterns in mistakes and strengths, making you a better trader over time."),
    q("i31","What is a dead cat bounce?","A genuine bull reversal","A temporary, short-lived price recovery in a downtrend before continuing lower","A bearish chart pattern","A breakout above resistance","b","A dead cat bounce is a brief relief rally within a larger downtrend — driven by short covering or bargain hunters, not real buying interest."),
    q("i32","What is the ATR (Average True Range) indicator?","An oscillator measuring overbought/oversold","A volatility indicator measuring the average range of price movement over a set period","A moving average type","A volume-based indicator","b","ATR tells you how much an asset typically moves — useful for setting stop losses proportional to volatility rather than arbitrary fixed levels."),
    q("i33","What is a head and shoulders pattern?","A bullish continuation pattern","A three-peak reversal pattern — two shoulders with a higher head — signalling a potential top","A triple bottom pattern","A flag pattern","b","Head and shoulders: left shoulder, higher head, right shoulder — when price breaks the neckline connecting the shoulder lows, it's a bearish reversal signal."),
    q("i34","What is a double top pattern?","A bullish reversal","Two consecutive peaks at approximately the same price level — bearish reversal signal","A consolidation pattern","A breakout confirmation","b","A double top forms when price hits the same resistance twice and fails — the second rejection confirms sellers defend that level, and a break of the valley signals reversal."),
    q("i35","What is a double bottom pattern?","A bearish reversal","Two consecutive lows at approximately the same price level — bullish reversal signal","A continuation pattern","A triangle pattern","b","A double bottom (W-shape) forms when price tests the same support twice and bounces — a break above the peak between the lows confirms the reversal."),
    q("i36","What is a pennant pattern in technical analysis?","A bearish reversal signal","A brief symmetrical consolidation after a strong move — continuation pattern, typically breaks in the same direction","A type of Doji","A triple top","b","A pennant forms after a strong impulse move — price consolidates in converging lines, then breaks out in the original direction as the next leg of the move."),
    q("i37","What is a cup and handle pattern?","A bearish pattern","A bullish continuation pattern shaped like a cup with a small handle before an upside breakout","A reversal pattern","A bearish flag","b","Cup and handle: a rounded base (cup) followed by a small downward consolidation (handle) — breakout above the handle's resistance targets the cup depth projected upward."),
    q("i38","What is the Ichimoku Cloud indicator?","An RSI variation","A comprehensive trend indicator showing support/resistance, trend direction, and momentum through cloud zones","A Bollinger Band variant","A volume profile","b","Ichimoku Cloud identifies trend direction (price above/below cloud), strength (cloud thickness), and provides dynamic support/resistance from multiple averaged lines."),
    q("i39","What is the stochastic oscillator?","A trend-following indicator","A momentum indicator comparing a closing price to its price range over a specific period — signals overbought/oversold conditions","A volume indicator","A type of moving average","b","Stochastics oscillate 0-100; above 80 is overbought, below 20 is oversold. Crossovers of the %K and %D lines inside these zones generate buy/sell signals."),
    q("i40","What is on-balance volume (OBV)?","A price indicator","A cumulative volume indicator adding volume on up days and subtracting on down days — confirms trend strength","A type of moving average","A volatility measure","b","OBV rising with price confirms bullish momentum; OBV diverging (rising price but falling OBV) warns that the uptrend lacks conviction and may reverse."),
    q("i41","What is a flag pattern?","A reversal pattern","A brief rectangular consolidation after a sharp move — continuation pattern breaking in the same direction","A Doji variant","A double top","b","A flag forms as price consolidates in a tight range after a strong impulse — the breakout from the flag typically matches the length of the initial pole."),
    q("i42","What is the key difference between a continuation and reversal pattern?","No difference","Continuation patterns predict price continuing in the same direction; reversal patterns predict a change in direction","Only pattern shape differs","Reversal patterns are more reliable","b","Continuation patterns (flags, pennants, triangles) predict trend resumption; reversal patterns (H&S, double tops, morning star) signal the end of the current trend."),
    q("i43","What does 'higher high, higher low' (HH/HL) mean?","A bearish trend structure","The price structure of an uptrend — each swing peak and swing trough is higher than the previous","A sideways market","A double top formation","b","HH/HL confirms an uptrend — buyers are consistently pushing price to new highs and defending higher lows. Break of the most recent HL signals trend weakness."),
    q("i44","What is a 'fake-out' or false breakout?","A genuine breakout with volume","When price briefly breaks above/below a key level but immediately reverses — trapping breakout traders","A strong trending move","A gap in price","b","False breakouts trap traders who entered on the break — they reverse quickly, stopping out impulsive entries. Waiting for a candle close beyond the level filters many fakes."),
    q("i45","What is the significance of the 200-period moving average?","No special significance","One of the most widely watched long-term trend indicators — price above 200 MA is bullish; below is bearish across all markets","A short-term indicator","A volume average","b","The 200-period MA is the institutional trend benchmark — used by funds, banks, and retail traders globally. Strong support when trending up, strong resistance when below."),
  ] };

  // ── Tier: Advanced ────────────────────────────────────────────────────────

  func advancedQuestions() : [Types.QuizQuestion] { [
    q("a01","What are Fibonacci retracement levels based on?","Random percentage levels","Mathematical ratios derived from the Fibonacci sequence — key levels: 23.6%, 38.2%, 50%, 61.8%, 78.6%","Moving average calculations","Volume averages","b","Fibonacci retracement uses ratios from the Fibonacci sequence to identify potential support/resistance during price pullbacks."),
    q("a02","Which Fibonacci level is often called the 'golden ratio retracement'?","38.2%","50%","61.8%","78.6%","c","The 61.8% Fibonacci level (derived from the golden ratio 0.618) is the most significant — often where strong trends resume."),
    q("a03","What is Elliott Wave Theory?","A volume-based trading method","A theory that market prices move in predictable 5-wave impulse and 3-wave corrective cycles","A type of moving average","A news-based strategy","b","Elliott Wave proposes that crowd psychology creates recurring patterns: 5 waves in the trend direction, followed by 3 corrective waves."),
    q("a04","In Elliott Wave, what are waves 1, 3, and 5?","Corrective waves against the trend","Impulse waves moving in the direction of the main trend","Fibonacci extension zones","Consolidation phases","b","Waves 1, 3, and 5 are the three impulse waves that drive price in the main trend direction — wave 3 is typically the strongest."),
    q("a05","What is a harmonic pattern in trading?","A pattern based on volume","A geometric price pattern using specific Fibonacci ratios — examples: Gartley, Butterfly, Bat, Crab","A candlestick pattern","An Elliott Wave sub-pattern","b","Harmonic patterns identify potential reversal zones using precise Fibonacci measurements across multiple price legs (XA, AB, BC, CD)."),
    q("a06","What is RSI divergence?","RSI and price moving together","When price makes new highs/lows but RSI fails to confirm — signals weakening momentum and potential reversal","RSI crossing the 50 level","RSI reaching overbought territory","b","Bearish RSI divergence: price makes higher high but RSI makes lower high — the rally is losing steam, reversal is possible."),
    q("a07","What is a MACD crossover signal?","MACD reaching zero","The MACD line crossing the signal line — above for bullish momentum, below for bearish","Two EMAs touching","MACD diverging from price","b","A MACD bullish crossover (MACD above signal) indicates growing upside momentum — bearish crossover (below signal) indicates downside."),
    q("a08","What is a Bollinger Band squeeze and what does it predict?","High volatility currently","Low volatility consolidation — predicts an imminent breakout in either direction","The trend is over","A reliable sell signal","b","A BB squeeze (tight bands) indicates a period of very low volatility — these phases frequently precede explosive directional moves."),
    q("a09","What is an order block in ICT methodology?","A large pending order on an exchange","A supply or demand zone formed by the consolidation candle directly before a significant institutional price move","A type of limit order","A pivot level","b","Order blocks are zones where institutions have placed large orders — when price returns, it often reacts as strong support/resistance."),
    q("a10","What is a fair value gap (FVG)?","An arbitrage opportunity","A price imbalance created when three candles leave an unfilled gap — price tends to return to fill it","A gap between Bollinger Bands","A support-resistance gap","b","An FVG (also called an imbalance) occurs when candle 1's high and candle 3's low don't overlap — leaving a zone price wants to revisit."),
    q("a11","What is market structure in technical analysis?","The economic structure of markets","The pattern of swing highs and swing lows defining trend direction — HH/HL (uptrend) or LH/LL (downtrend)","A regulatory concept","A type of chart","b","Market structure tracks swing highs (HH/LH) and swing lows (HL/LL) — the sequence of these tells you if the trend is up, down, or reversing."),
    q("a12","What is a Break of Structure (BOS)?","Price touching a moving average","Price creating a new swing high in an uptrend or new swing low in a downtrend — confirming trend continuation","A bearish reversal pattern","Support turning resistance","b","A BOS confirms the trend is intact — in an uptrend, each new higher high is a BOS showing buyers remain in control."),
    q("a13","What is a Change of Character (CHoCH)?","A candle body change","The first sign of a trend reversal — price breaks the most recent swing in the opposite direction to the prevailing trend","A BOS in the trend direction","A consolidation phase","b","A CHoCH is the first structural signal of a potential reversal — in an uptrend, it's when price breaks below the most recent higher low."),
    q("a14","What are supply and demand zones?","Fixed support/resistance levels","Price areas where large institutional buying (demand) or selling (supply) occurred, creating imbalances","Chart patterns","Fibonacci extensions","b","Supply zones are areas of prior heavy selling; demand zones are areas of prior heavy buying — price often revisits these institutional levels."),
    q("a15","What is a liquidity concept in smart money trading?","A DeFi protocol","Clusters of stop losses or pending orders above swing highs or below swing lows that institutional traders target","A measure of trading volume","How quickly you can sell an asset","b","In SMC, liquidity sits above equal highs (buy-side) and below equal lows (sell-side) — institutions move price to sweep this liquidity before reversing."),
    q("a16","What are basic ICT (Inner Circle Trader) concepts?","Random chart patterns","Order blocks, fair value gaps, liquidity sweeps, market structure, kill zones, and premium/discount zones","Elliott Wave counting","Fibonacci extensions only","b","ICT methodology is built on understanding how smart money (institutions) manipulates price to grab liquidity before making their real moves."),
    q("a17","What is confluence trading?","Using one indicator only","Combining multiple independent technical factors that all point in the same direction to increase setup quality","Trading multiple assets","Using automated signals","b","Confluence means several factors align — e.g. demand zone + FVG + bullish CHoCH + RSI oversold + NY kill zone. More factors = higher probability."),
    q("a18","How do major economic events affect markets?","They have no effect on technical analysis","High-impact news (NFP, CPI, Fed decisions) can cause rapid price spikes overriding technical levels","They only affect forex","They only affect stock markets","b","Economic events inject volatility into markets — CPI higher than expected can crash stocks; Fed dovishness can rally crypto. Always check the calendar."),
    q("a19","What is correlation between assets?","Causation between two assets","The degree to which two assets move together — positive (same direction) or negative (opposite direction)","A type of indicator","Volume relationship between pairs","b","Correlation matters for risk management — if BTC and ETH are highly correlated, holding both doesn't diversify your crypto risk."),
    q("a20","What is an advanced risk management strategy: partial position exit?","Closing 100% of the trade at TP1","Closing a portion of the position at TP1 to secure profits while leaving the rest to run to TP2 and TP3","Holding the entire position to TP3 always","Moving stop loss to TP1 immediately","b","Partial exits lock in profits at TP1/TP2 while letting a free-riding portion chase TP3 — reducing stress while maximising upside."),
    q("a21","What is scaling into a trade?","Putting all capital in at once","Opening an initial position then adding more at better prices as the trade moves in your favour","A risk management error","Averaging down on a loser","b","Scaling in means adding to a winning position at better prices — only valid when done on confirmations, never as 'averaging down' on losers."),
    q("a22","What is a trailing stop loss?","A fixed stop loss set at entry","A stop loss that automatically moves in the direction of a profitable trade to lock in gains","A guaranteed fill level","A stop set at a moving average","b","A trailing stop follows price as it moves in your favour — it locks in profits on the way up while giving the trade room to run further."),
    q("a23","What is reading market depth (order book)?","Analysing candlestick patterns","Viewing the live list of pending buy and sell orders at various price levels to understand where supply and demand sits","A type of volume analysis","A DeFi liquidity pool","b","The order book shows resting limit orders — large bid walls suggest demand; large ask walls suggest supply. Useful for short-term execution."),
    q("a24","What is a volume spike's significance?","Volume spikes are always bullish","A sudden surge in volume confirms the importance of a price move — breakouts on high volume are more reliable","Volume never matters in crypto","High volume always means reversal","b","Volume is the fuel of price movement — a breakout from consolidation or resistance on significantly above-average volume confirms the move."),
    q("a25","What is a descending triangle pattern?","A bullish reversal pattern","A continuation pattern with horizontal support and descending resistance — typically breaks down","An ascending wedge","A triple bottom","b","A descending triangle has flat support being tested and falling resistance — it signals accumulating selling pressure often resolving in a breakdown."),
    q("a26","What is a rising wedge pattern and its typical implication?","Bullish continuation always","A converging pattern with both trendlines sloping upward — typically a bearish reversal signal","A bullish flag pattern","A triangle breakout","b","A rising wedge sees price making higher highs and higher lows but with narrowing range — this exhaustion typically breaks to the downside."),
    q("a27","What is the significance of multiple timeframe confluence for a trade entry?","Timeframes are irrelevant","When higher TF (daily/weekly) shows a key level and lower TF (1H/15M) shows a trigger pattern, quality increases significantly","Only use one timeframe","Higher timeframes are less reliable","b","Multi-TF confluence: if the daily chart shows a demand zone and the 1H shows a bullish CHoCH within it, the setup has much higher probability."),
    q("a28","What is an inside bar pattern?","Any two consecutive candles","A candlestick whose high and low fall completely within the range of the preceding bar — signals consolidation before a move","A bullish engulfing","A Doji pattern","b","An inside bar shows the market contracted within the previous candle's range — a breakout of the inside bar often leads to a strong directional move."),
    q("a29","What is the significance of round numbers as key levels?","They have no significance","Psychological levels like 50,000 BTC or 1.2000 EUR/USD attract heavy order clustering — they act as strong support/resistance","Only Fibonacci levels matter","Round numbers only matter for stocks","b","Traders and institutions place stops, limits, and targets at round numbers — making these self-fulfilling levels of significant supply/demand."),
    q("a30","What is the overall framework of combining structure, zones, and confirmation?","Use only one analysis method","Identify structure direction on higher TF, locate order block/demand zone, wait for CHoCH or BOS confirmation on lower TF","Rely on indicators alone","Trade every support and resistance touch","b","The advanced framework: use HTF structure for direction → find order block or FVG → wait for LTF confirmation (CHoCH + entry candle) → enter with SL below the zone."),
    q("a31","What is a symmetrical triangle pattern?","Always breaks upward","A converging pattern with descending highs and ascending lows — a breakout in either direction is expected","A continuation pattern only","A reversal pattern always","b","A symmetrical triangle represents market indecision with both buyers and sellers ceding ground — the breakout direction (with volume) tells you the next move."),
    q("a32","What is the significance of the 'three drives' harmonic pattern?","A continuation pattern","A three-push harmonic reversal pattern using specific Fibonacci ratios at each drive — predicts exhaustion","A random price pattern","An Elliott Wave component","b","Three drives: three equal-ratio moves in one direction reaching completion zones — the third drive typically exhausts the trend and signals a high-probability reversal."),
    q("a33","What is a Wyckoff accumulation schematic?","A random price pattern","A structured market cycle showing how institutional traders accumulate positions in a range before a major uptrend","An Elliott Wave variation","A harmonic pattern","b","Wyckoff accumulation: preliminary support, selling climax, automatic rally, secondary test, spring (fakedown), sign of strength, last point of support — then markup."),
    q("a34","What is the 'spring' in Wyckoff analysis?","A price bounce","A false breakdown below the trading range support that shakes out weak holders before a major upside move","A seasonal pattern","A reversal candlestick","b","The spring is the most important Wyckoff signal — price briefly breaks support to grab liquidity (stop losses), then reverses sharply upward, completing accumulation."),
    q("a35","What is a liquidity void?","An area of high volume","A price zone with very little historical trading — price tends to move rapidly through these areas when entered","A support zone","An order book area","b","Liquidity voids (low-volume nodes in volume profile) are 'fast lanes' — price moves through them quickly as there are few resting orders to absorb the move."),
    q("a36","What is an engulfing bar on a key level?","Any two-candle pattern","A high-probability reversal signal when a large candle completely engulfs the previous candle at a significant support/resistance zone","A continuation pattern","A breakout confirmation","b","An engulfing bar at a key level (order block, FVG, round number) is one of the strongest single-bar reversal signals — especially when combined with RSI divergence."),
    q("a37","What is range expansion in volume profile?","Price moving sideways","Price breaking out of the value area with above-average volume — signals the beginning of a new trend","A squeeze signal","A reversal signal","b","When price leaves the volume profile value area with conviction (high volume, large candle), it signals range expansion — the market has found new value at different prices."),
    q("a38","What is the 'last point of support' (LPS) in Wyckoff analysis?","The final support level in a downtrend","A pullback after the sign of strength in accumulation — the final low-risk buying opportunity before markup begins","A breakdown signal","A resistance zone","b","After the sign of strength (SOS) rally, price pulls back on lower volume to the LPS — this is Wyckoff's optimal entry point for the upcoming markup phase."),
    q("a39","What is a kill zone in ICT methodology?","A stop loss level","Specific time windows during London and New York session opens when institutional activity is highest — optimal entry times","A supply zone","An order block area","b","ICT kill zones: London open (2-5am EST), New York open (7-10am EST), London close (10am-12pm EST). These periods see the highest institutional order flow and best setups."),
    q("a40","What is the concept of premium vs discount in ICT?","Trade direction bias","Price above the equilibrium (50% of a range) is 'premium' (expensive, prefer shorts); below is 'discount' (cheap, prefer longs)","A fee structure","A risk management concept","b","ICT premium/discount: identify the range between a swing low and swing high — above 50% is premium (sell bias), below 50% is discount (buy bias). Align with this for optimal entries."),
    q("a41","What is an optimal trade entry (OTE) in ICT?","Any entry point","The 62-79% Fibonacci retracement zone of a swing — where ICT traders look for a lower-risk entry into a new impulse move","A stop loss level","A take profit zone","b","ICT's OTE sits at the 62-79% Fibonacci retracement — after a displacement move, price retraces to this zone (often within an order block) to offer the best risk-reward entry."),
    q("a42","What is market maker buy model?","A bullish continuation pattern","An ICT model where market makers accumulate sell-side liquidity, create a displacement move upward, then fill orders to create the actual trend","A Wyckoff concept","An Elliott Wave pattern","b","Market maker models describe the institution's playbook: sweep sell-side liquidity (stop hunt below lows) → displace upward (BOS) → distribute at premium → reverse. Understanding this gives enormous edge."),
    q("a43","What is a 'mitigation block'?","A failed order block","An area where a prior order block's imbalance was partially or fully mitigated (filled) — may become a reaction zone again","A supply zone","A breakout level","b","A mitigation block is where price returns to fill an imbalance created by a previous strong move — once mitigated, it may act as a pivot zone for the next move."),
    q("a44","What are 'equal highs' and 'equal lows' in SMC?","Random coincidences","Price levels where two or more swing highs/lows are at the same price — they represent resting liquidity that institutions target","Chart patterns","Fibonacci levels","b","Equal highs/lows are liquidity pools — above equal highs = buy-side liquidity (BSL); below equal lows = sell-side liquidity (SSL). Institutions move price to sweep these before reversing."),
    q("a45","What is institutional candle displacement?","A regular large candle","A strong, high-volume candle (often 3-4x average size) leaving a fair value gap — marks institutional entry and signals directional bias","A gap in price","A momentum indicator","b","Displacement candles mark where institutions entered aggressively — the FVG they leave is a magnet for price to return to (order filling), making it a high-probability entry zone."),
  ] };

  // ── Tier: Expert ──────────────────────────────────────────────────────────

  func expertQuestions() : [Types.QuizQuestion] { [
    q("e01","What are Smart Money Concepts (SMC)?","Retail trading strategies","A framework tracking institutional order flow through order blocks, liquidity sweeps, fair value gaps, and market structure","A DeFi protocol","Moving average strategies","b","SMC focuses on understanding how large institutional players (banks, hedge funds) move price to gather liquidity before executing real moves."),
    q("e02","What is institutional order flow?","Retail trading patterns","The actual buying and selling activity of large institutions (banks, hedge funds) that drives meaningful price movement","News-driven trading","A type of automated trading","b","Institutional order flow creates significant price displacement — understanding it allows you to trade in alignment with the 'smart money' rather than against it."),
    q("e03","What is a liquidity sweep?","Filling a large buy order","Price briefly running above swing highs or below swing lows to trigger stop orders and pending orders before reversing","A DeFi liquidity event","A breakout confirmation","b","A liquidity sweep targets the stop losses and pending orders clustered at swing highs/lows — institutions sweep this liquidity to fill their own positions."),
    q("e04","What is a stop loss hunt by institutions?","A broker error","Deliberate price move to trigger retail stop losses clustered at obvious levels — providing institutions liquidity to enter positions","A legitimate price move","High volatility random event","b","Institutions move price to 'obvious' stop levels (below recent lows, above recent highs) to trigger retail stop outs, then reverse — this is engineered liquidity."),
    q("e05","What is order flow imbalance?","Equal buy and sell pressure","A situation where buying or selling pressure significantly outweighs the other side — creating strong directional moves","A type of chart gap","A market maker error","b","Order flow imbalance means one side (buyers or sellers) dominates — visible in the order book as depleted liquidity on one side causing rapid price movement."),
    q("e06","What is volume profile analysis?","Standard volume bars on a chart","A tool showing the distribution of volume traded at each price level — revealing high-volume nodes (HVN) and low-volume nodes (LVN)","A type of moving average","An options-based analysis","b","Volume profile shows where the most trading has occurred at specific prices — price tends to accept at HVNs and move quickly through LVNs."),
    q("e07","What is VWAP (Volume Weighted Average Price) and why do institutions use it?","A simple moving average","Volume-weighted average price used as an institutional execution benchmark — price trading above VWAP is bullish intraday","A type of oscillator","A daily open price","b","VWAP is the institution's benchmark — they aim to buy below VWAP and sell above it. Price reclaiming VWAP is a bullish signal; losing it is bearish."),
    q("e08","What is the market profile (TPO chart)?","A volume bar chart","A chart showing at which prices and times trading occurred — reveals market structure as 'value areas' and 'poor highs/lows'","A type of order book","A harmonic pattern","b","Market profile organises time spent at each price (TPO letters) — the value area holds 70% of volume. Poor highs/lows (single prints) tend to get revisited."),
    q("e09","What is inter-market analysis?","Comparing two forex pairs only","Analysing relationships between stocks, bonds, commodities, currencies, and crypto to forecast one market using another","A type of portfolio comparison","Correlation between two indicators","b","Inter-market analysis: rising bond yields typically pressure stocks; strong USD typically weakens commodities; crypto often leads risk appetite."),
    q("e10","What is currency strength analysis in forex?","Comparing two currency pairs","Measuring the relative strength of individual currencies across all pairs to identify the strongest vs weakest for optimal trade pairing","A type of fundamental analysis","Trading only one pair","b","Currency strength analysis finds the strongest and weakest currencies — pairing the strongest against the weakest (e.g. strong USD vs weak JPY) gives highest-probability forex setups."),
    q("e11","What are the three main forex trading sessions and their characteristics?","Only London and New York sessions","Asian (quiet), London (high volatility, trends), New York (highest volume, overlap with London is most liquid)","Day and night sessions","Only the New York session matters","b","Forex has three sessions: Asian (9pm-6am GMT, low volatility), London (8am-5pm, trends form), NY (1pm-10pm, highest volume, overlap 1-5pm most active)."),
    q("e12","What is the crypto market cycle?","Random price movements","Accumulation → markup (bull run) → distribution → markdown (bear market) — driven by halving cycles and macro liquidity","A 4-year fixed cycle only","A technical indicator","b","Crypto cycles typically follow Bitcoin halvings — accumulation after bottoms, markup bull run, distribution at tops, markdown bear phase — repeating roughly every 4 years."),
    q("e13","What are basic stock market fundamentals relevant to traders?","Irrelevant to technical trading","P/E ratio, earnings per share, revenue growth, and sector rotation — provide context for broader market direction and individual stock bias","Balance sheet analysis only","Interest rates only","b","While traders use technicals for timing, fundamentals (earnings beats, revenue growth, sector strength) provide directional bias for stock selection and overall market positioning."),
    q("e14","What are options basics relevant to a trader?","Options are irrelevant to spot trading","Options give the right (not obligation) to buy/sell at a set price — call options are bullish, put options are bearish, used for hedging or directional bets","Only used by institutions","A type of futures contract","b","Understanding calls (bet on rise) and puts (bet on decline) helps traders hedge positions, gauge market sentiment via put/call ratio, and exploit volatility."),
    q("e15","What is statistical edge in trading?","Winning every trade","A combination of positive expectancy (win rate × avg win > loss rate × avg loss) that produces reliable profit over a large sample","Being disciplined","Using the best indicators","b","Statistical edge means your strategy's mathematical expectancy is positive — even a 40% win rate is profitable with a 1:3 risk-reward. Edge is proven over hundreds of trades."),
    q("e16","What components make up a complete trading system?","Just an entry signal","Entry rules, exit rules (SL and TP), position sizing, risk management rules, market selection criteria, and review process","A set of indicators","A chart setup alone","b","A complete trading system defines everything: what to trade, when to enter, where to exit (SL/TP), how much to risk, how to review performance. Nothing is left to chance."),
    q("e17","What is backtesting methodology?","Guessing future performance","Systematically applying trading rules to historical price data to measure hypothetical past performance before risking real money","Forward testing on demo","Automated trading","b","Rigorous backtesting: define rules precisely, apply to out-of-sample historical data, track all metrics (win rate, expectancy, max drawdown), avoid curve-fitting."),
    q("e18","What is Monte Carlo simulation applied to trading?","Testing on demo account","Randomly shuffling historical trade sequences thousands of times to estimate the probability distribution of outcomes and worst-case drawdowns","A type of backtesting","An options pricing model","b","Monte Carlo simulation reveals the range of possible equity curves given your strategy's statistics — it shows the true worst-case drawdown you may face."),
    q("e19","What is portfolio correlation risk?","Risk from a single trade","The risk that multiple positions in your portfolio move adversely together because they are highly correlated — amplifying losses","Drawdown from leverage","Currency conversion risk","b","If all your positions correlate (e.g. multiple crypto pairs during a crash), you can't escape the loss. True diversification requires low or negative correlation."),
    q("e20","What is the Kelly Criterion in position sizing?","A fixed 2% risk rule","A mathematical formula calculating the optimal fraction of capital to risk per trade to maximise long-term geometric growth","The maximum leverage allowed","A trade frequency formula","b","Kelly formula: f = (W × R − L) / R where W=win probability, L=loss probability, R=win/loss ratio. Often used at half-Kelly for safety."),
    q("e21","What is the Sharpe ratio?","Profit divided by number of trades","A risk-adjusted return metric: (average return − risk-free rate) ÷ standard deviation of returns","Win rate divided by loss rate","Total P&L over time","b","A higher Sharpe ratio means more return per unit of risk. Sharpe > 1 is good; > 2 is excellent; > 3 is exceptional. Helps compare strategies fairly."),
    q("e22","What is maximum drawdown?","A single day's loss","The largest peak-to-trough decline of an account over a given period — measures worst-case loss experience","Average daily loss","The stop loss percentage","b","Maximum drawdown tells you the worst loss a strategy has experienced historically — essential for understanding whether you can emotionally and financially sustain a strategy."),
    q("e23","What is a drawdown recovery calculation?","Simple arithmetic","A 50% drawdown requires a 100% gain to recover — drawdown recovery grows exponentially harder as losses increase","Recovering the loss amount","Doubling your position size","b","Drawdown recovery math: a 10% loss needs 11.1% to recover; 50% loss needs 100%; 75% loss needs 300%. Avoiding large drawdowns is mathematically critical."),
    q("e24","What is the difference between systematic and discretionary trading?","No real difference","Systematic = strictly rule-based mechanical execution; Discretionary = human judgment and interpretation for each trade","Systematic is manual","Systematic only uses algorithms","b","Systematic traders follow defined rules with no exceptions — removing emotion. Discretionary traders exercise judgment. Both can work; the key is consistency in approach."),
    q("e25","What is forward testing (paper trading)?","Testing on historical data","Running a strategy in real-time on a demo or small live account to validate backtesting results before full deployment","An automated backtest","A risk-free test using algorithms","b","Forward testing bridges the gap between historical backtesting and live trading — it validates that your system performs similarly in real-time conditions."),
    q("e26","What is the put-call ratio and how is it used?","Ratio of wins to losses","The ratio of put options to call options traded — high ratio signals bearish sentiment; low ratio signals bullish (often used as contrarian indicator)","A P&L metric","An options pricing component","b","A high put/call ratio means more traders are buying protection (bearish) — but extreme readings are contrarian signals (market may be near a bottom)."),
    q("e27","What is the VIX index?","A stock price index","The CBOE Volatility Index measuring expected S&P 500 volatility over 30 days — the 'fear gauge'","A crypto fear index","A forex indicator","b","VIX above 30 signals extreme fear/uncertainty (often a buying opportunity); VIX below 15 signals complacency. Traders use it to gauge overall market sentiment."),
    q("e28","What is market regime detection?","Identifying a chart pattern","Identifying the current market environment (trending, ranging, high-volatility, low-volatility) to deploy the correct strategy","A news analysis method","Detecting broker manipulation","b","Different strategies work in different regimes — trend-following in trending markets, mean-reversion in ranging. Regime detection prevents applying the wrong approach."),
    q("e29","What is the risk of ruin?","Losing all profit in one trade","The mathematical probability of losing an entire trading account given your win rate, average risk per trade, and maximum drawdown tolerance","Leverage risk only","A single bad trade loss","b","Risk of ruin quantifies the danger of complete account loss. Even a profitable strategy can have significant ruin probability if position sizes are too large."),
    q("e30","What is the complete process of building a robust trading system?","Find a good indicator","Define edge → backtest on historical data → forward test on demo → validate statistically → deploy live with strict risk management → review periodically","Copy another trader's system","Use automated signals","b","A robust system: identify hypothesis → code precise rules → backtest (out-of-sample) → Monte Carlo stress test → paper trade → small live deployment → scale with proven edge."),
    q("e31","What is flow trading?","Trading with the trend","Trading aligned with institutional order flow — reading large-lot order activity to identify where institutions are accumulating or distributing","A DeFi strategy","A news-based approach","b","Flow trading reads where institutions are actually doing business — not just where retail thinks they will. Delta divergence, large lot absorption, and sweep-and-go patterns reveal true flow."),
    q("e32","What is delta in order flow analysis?","An options metric","The difference between buy market orders and sell market orders — positive delta = net buying pressure; negative = net selling","A momentum oscillator","A volatility measure","b","Delta shows real-time buying vs selling aggression — cumulative delta diverging from price is a powerful warning of impending reversal."),
    q("e33","What is the significance of a 'point of control' (POC) in volume profile?","A random support level","The price level with the highest volume traded in a session or period — strong magnet for price to revisit","A daily high or low","A moving average level","b","The POC is the 'fairest' price — where the most business was done. Price gravitates toward the POC when nearby, and it often acts as support/resistance after being left behind."),
    q("e34","What is a 'naked' point of control?","An uncovered trade","A prior session's POC that price has never returned to — it exerts strong gravitational pull until revisited","A volume spike","A gap in price","b","Naked POCs are unfilled magnets — markets tend to revisit them. Identifying multiple unvisited POCs ahead of price reveals likely price targets and reaction zones."),
    q("e35","What is dealer inventory risk in market making?","A broker's fee","The risk a market maker takes on when accumulating one-sided inventory — creates price moves as they hedge their book","A retail trader concern","A DeFi liquidity issue","b","When market makers accumulate too much inventory on one side, they must hedge — this hedging creates directional price moves. Understanding dealer positioning is advanced flow analysis."),
    q("e36","What is the concept of 'time' in trading edge?","Trade duration only","Edge degrades as more traders discover it — strategies must evolve continuously to maintain positive expectancy","A market timing indicator","A backtesting variable","b","Every edge has a life cycle — once a pattern becomes widely known and traded, it gets arbitraged away. The best traders continuously research and adapt their approach."),
    q("e37","What is factor investing?","A type of fundamental analysis","Systematic investing based on well-documented return factors: momentum, value, quality, low volatility, size — each with persistent statistical edge","A technical analysis method","Copy trading","b","Factor investing (Fama, French, Carhart) identified systematic risk premia — momentum (winners keep winning), value (cheap beats expensive), quality (profitable beats unprofitable) — over long horizons."),
    q("e38","What is mean reversion?","Trend following","The tendency of prices to revert toward a long-term average — exploited by strategies that fade extreme moves","A breakout strategy","An Elliott Wave concept","b","Mean reversion strategies sell overbought extremes and buy oversold extremes — they work best in ranging markets with well-defined value areas."),
    q("e39","What is carry trade in forex?","Buying high-momentum currencies","Borrowing in a low-interest-rate currency to invest in a high-interest-rate currency — capturing the interest rate differential","A technical trading strategy","A short-term scalp","b","Carry trade: borrow JPY at 0.1%, invest in AUD at 4% = 3.9% annual carry. Carry trades work in low-volatility environments but unwind violently when risk aversion spikes."),
    q("e40","What is the Commitment of Traders (COT) report?","A trading journal template","A weekly CFTC report showing net long/short positions of commercial (hedgers), large speculators, and small speculators in futures markets","A retail sentiment survey","An options report","b","COT reveals what the 'smart money' (commercial hedgers) is actually doing vs what retail is doing. Extreme commercial positioning often precedes major trend reversals."),
    q("e41","What is the concept of 'edge decay' in trading?","Losing money slowly","The gradual erosion of a strategy's historical edge as market conditions change or more traders adopt the same approach","A drawdown phase","A volatility decrease","b","Edge decay is inevitable — markets evolve, correlations change, and strategies stop working as they become crowded. Monitoring live performance versus backtest expectations reveals decay early."),
    q("e42","What is cross-asset momentum?","Momentum on a single chart","The tendency for strong performance in one asset class to predict near-term performance in related asset classes","A type of indicator","A correlation strategy","b","Cross-asset momentum: strong US stocks tend to benefit USD; weak gold correlates with strong USD; crypto momentum often follows risk appetite. These inter-market flows create tradeable setups."),
    q("e43","What is a 'black swan' event in trading?","A rare profitable trade","An extremely rare, high-impact, unpredictable event that falls outside normal probability distributions — e.g. COVID crash, 2008 crisis","A chart pattern","A type of news release","b","Black swans (Nassim Taleb) are fat-tail events that standard risk models fail to price — they destroy leveraged portfolios and accounts without hard stops and position limits."),
    q("e44","What is basis risk in hedging?","Leverage risk","The risk that the hedge instrument doesn't perfectly offset the exposure being hedged — correlation between hedge and position isn't 1.0","A type of stop loss","Market liquidity risk","b","Basis risk means even a 'perfect' hedge can fail if the hedge instrument diverges — e.g. hedging BTC with ETH shorts assumes they stay correlated, which may not hold in a crash."),
    q("e45","What is stress testing a trading system?","Testing in a bull market only","Running the strategy through the worst historical market conditions (crashes, high-volatility periods, flash crashes) to assess resilience","A basic backtest","Demo account testing","b","Stress testing simulates how your system performs in the worst possible conditions — identifying maximum drawdown, recovery time, and whether position limits hold under extreme stress."),
  ] };

  // ── Tier: Master ──────────────────────────────────────────────────────────

  func masterQuestions() : [Types.QuizQuestion] { [
    q("m01","What is full trading system design?","Choosing indicators","A complete framework covering market selection, entry/exit rules, position sizing, risk limits, review process, and psychological protocols","An automated algorithm only","A signal subscription plan","b","A complete trading system is a rulebook covering every scenario — what to trade, when, how much, where to exit, and how to improve. Nothing is left to discretion."),
    q("m02","What is a market inefficiency?","A broker pricing error","A consistent pricing anomaly in markets that a trader can exploit for edge — typically short-lived due to competitive discovery","A random price spike","A liquidity gap","b","Market inefficiencies are exploitable pricing patterns — they exist temporarily until enough traders discover and arbitrage them away. Finding new ones is the quest for alpha."),
    q("m03","What is quantitative analysis (quant) in trading?","Fundamental analysis","Using mathematical and statistical models to identify trading signals and test strategies rigorously","Chart reading only","News-based trading","b","Quantitative analysis uses data science, statistics, and algorithms to find and test edges systematically — removing human bias from the research process."),
    q("m04","What is algorithmic (algo) trading?","Manual trading with a plan","Trading using computer programs that execute predefined rules automatically — faster and more systematic than manual trading","High-frequency trading only","Copy trading","b","Algo trading automates strategy execution — from simple rule-based systems to complex ML models. It removes emotional execution errors and enables strategies humans can't execute manually."),
    q("m05","What is high-frequency trading (HFT)?","Fast manual trading","Algorithmic trading executing thousands to millions of orders per second, exploiting micro price discrepancies with co-located servers","Day trading with algorithms","Automated swing trading","b","HFT firms use ultra-low latency infrastructure (co-location, direct market access) to capture tiny edges across enormous order volumes — inaccessible to retail traders."),
    q("m06","What is behavioural finance?","Technical analysis","The study of how cognitive biases and psychological factors influence financial decision-making and create market anomalies","Fundamental analysis","Options theory","b","Behavioural finance (Kahneman, Tversky, Thaler) shows that markets are systematically irrational — overconfidence, loss aversion, and herding create exploitable patterns."),
    q("m07","What is auction market theory?","A DeFi concept","A framework describing markets as continuous auctions seeking to find prices that facilitate the most trade — value areas, balance, and imbalance","A broker model","A type of order book","b","Auction market theory (Steidlmayer) views price as a discovery process — markets move away from value to find new buyers/sellers, then return to balance."),
    q("m08","What does price action mastery involve?","Using many indicators","Reading raw price movement through candlesticks, structures, and patterns without reliance on lagging indicators","Memorising chart patterns","Using an automated system","b","Price action mastery means reading the story the market tells directly: structure, momentum, rejection, accumulation, and distribution — in real time, without indicator lag."),
    q("m09","What is trading the news (economic calendar trading)?","Avoiding all news events","Understanding high-impact economic releases (NFP, CPI, FOMC, GDP) and their likely effect on markets — using the calendar to time or avoid trades","A fundamental investing strategy","A long-term approach only","b","NFP beats USD, CPI above forecast hurts stocks/crypto, FOMC hawkishness raises bond yields and pressures risk assets. Mastering this adds an important macro layer to technical analysis."),
    q("m10","What is the concept of creating your own indicator?","Downloading indicators online","Understanding the mathematical logic behind indicators well enough to design custom signals tailored to your specific strategy and market","Using default platform indicators","Combining existing indicators","b","Master traders understand indicator math (moving averages, oscillators) well enough to design custom versions — e.g. a custom momentum indicator tuned to crypto session timings."),
    q("m11","What does managing a trading business entail?","Just placing trades","Treating trading as a professional business: tracking P&L, separating business and personal accounts, reviewing performance, managing taxes, and continuous education","Having a large account","Using a financial advisor","b","A professional trading business has systems for everything: trade tracking, performance review, tax records, education budget, risk capital separate from living expenses, and continuous improvement."),
    q("m12","What are basic tax considerations for traders?","Trades are never taxed","Profitable trades may be subject to capital gains tax (short-term or long-term), and many jurisdictions require detailed trade records — seek professional advice","All profits are tax-free","Only apply to stocks","b","Tax laws vary by jurisdiction — short-term capital gains (held < 1 year) are often taxed as ordinary income; long-term gains at a lower rate. Accurate records are mandatory."),
    q("m13","What is psychological edge over other traders?","Having better technology","Maintaining emotional neutrality — executing your plan without fear, greed, or revenge — while others let emotion override their strategy","Using more indicators","Having a larger account","b","Psychological edge is the ultimate advantage — your strategy could be mediocre, but flawless execution over thousands of trades outperforms a great strategy with poor execution."),
    q("m14","What is the role of discipline and consistency in trading mastery?","Only relevant for beginners","The foundation of professional trading — consistent rule-following over thousands of trades is what converts an edge into actual profit","Discipline is overrated","Just execute every signal","b","Discipline means executing your plan every time without exception — consistency converts statistical edge into real returns. One undisciplined trade can erase a week of gains."),
    q("m15","What does building trading rules involve?","Writing general guidelines","Creating specific, tested, unambiguous rules for every scenario: entry conditions, exit conditions, trade management, position sizing, and daily/weekly limits","Using default platform rules","Copying a trader's rulebook","b","Rules must be precise enough that two different traders following them produce the same trades. Ambiguous rules introduce discretion, which introduces emotion."),
    q("m16","What is the journaling and review process at the master level?","Writing trade details only","Deep review of every trade: emotional state, adherence to rules, execution quality, missed setups, and identifying systemic patterns for improvement","Checking P&L only","Monthly review only","b","Master-level journaling includes process grades (did I follow the plan?) separate from outcome grades (did I make money?) — process always precedes outcome."),
    q("m17","What is multi-strategy portfolio management?","Trading one strategy only","Running multiple uncorrelated strategies across different markets and timeframes to smooth equity curve and reduce drawdowns","Having many trades open simultaneously","Copy trading many traders","b","Running correlated strategies amplifies risk; uncorrelated strategies (e.g. trend-following + mean-reversion + fundamental) smooth the equity curve significantly."),
    q("m18","What is risk of ruin calculation?","Simple probability","Using mathematical formulas combining win rate, risk per trade, and consecutive loss probability to calculate the chance of total capital loss","Stop loss placement","Drawdown measurement","b","Risk of ruin: R = ((1−W)/W)^(B/R_per_trade) where W=win rate. With 50% win rate and 2% risk per trade, ruin (−100%) is mathematically very unlikely over normal samples."),
    q("m19","What is DemonZeno signal mastery?","Using signals blindly","Understanding how to read Entry/SL/TP1/TP2/TP3 with optimal position sizing, partial exits at each TP, trailing stop after TP1, and adjusting risk based on signal context","Only targeting TP3 always","Never using stop losses","b","DemonZeno signal mastery: enter at Entry, set SL as defined, take 50% at TP1, trail stop to entry, take 25% at TP2, let 25% run to TP3 — maximising profit while locking gains."),
    q("m20","What is trading career development?","Trading for one year","A structured progression from learning → backtesting → demo → small live → scaling — with milestones, mentorship, and continuous education as a lifelong professional practice","Quitting after profits","Automating everything immediately","b","A trading career develops systematically — years of study and demo, then small live account, then scaling with consistent profitability. Rush any phase and you risk ruin."),
    q("m21","What is the concept of second-level thinking (Howard Marks)?","Reacting to news","Thinking beyond first-order reactions — 'What does everyone else think? What am I seeing that they are missing? What is the consensus missing?' — the source of alpha","Fundamental analysis","A chart analysis method","b","Second-level thinking asks not 'what happened?' but 'how will other market participants react to this, and how will THAT reaction create opportunity?' — the edge of elite traders."),
    q("m22","What is portfolio heat?","Portfolio temperature metrics","The sum of all open trade risk as a percentage of account — total portfolio risk exposure across all concurrent positions","Daily P&L volatility","Number of open trades","b","Portfolio heat is total concurrent risk — e.g. 3 trades each risking 2% = 6% portfolio heat. Keeping heat below 8-10% prevents catastrophic correlated drawdowns."),
    q("m23","What is tail risk and how do masters manage it?","The risk of any loss","The probability of extreme adverse events (Black Swans) beyond normal distribution — managed through position limits, stops, hedging, and cash reserves","Daily drawdown risk","Leverage risk only","b","Tail risk management: cap maximum position size, use hard stops always, keep a portion of capital in cash/hedge, never use maximum leverage, plan for 'if everything goes wrong simultaneously'."),
    q("m24","What is the efficient market hypothesis and its practical trading implications?","Markets are always beatable","The theory that prices reflect all available information — its practical implication is that exploitable edges are rare, short-lived, and require genuine insight to find","A momentum theory","A chart analysis framework","b","EMH implies: don't trade on widely known patterns (already priced in), focus on information asymmetry or behavioural biases for edge, and continuously seek new market inefficiencies."),
    q("m25","What is loss aversion and how does it harm trading?","Avoiding risk","The psychological tendency to feel losses ~2x more intensely than equivalent gains — causes holding losers too long, cutting winners early, and revenge trading","A risk metric","A fundamental bias in trading systems","b","Loss aversion drives the worst trading mistakes: holding a −$200 trade hoping for recovery instead of cutting at −$100, or closing a +$200 winner early to 'lock in' rather than letting it reach +$400."),
    q("m26","What is convexity of returns in trading?","Bond convexity","Asymmetric payout structures where losses are capped but profits are theoretically unlimited — achieved through options or asymmetric trade structures","A portfolio metric","A leverage calculation","b","Convex trade structures risk small amounts for potentially outsized gains — e.g. buying options, entering breakouts with tight stops near key zones. This is the holy grail of trade structuring."),
    q("m27","What is a complete performance review process?","Checking account balance","Systematic weekly/monthly review: total P&L, per-setup performance, adherence to rules (process score), biggest mistakes, best trades, and next-period adjustments","Reading news articles","Watching market videos","b","Performance review: track by setup type not just total P&L, score process adherence separately from outcome, identify recurring mistakes, make one improvement at a time — the professional's growth engine."),
    q("m28","What is the concept of 'trading like a business' versus 'gambling'?","They are the same","Business: defined edge, risk management, record-keeping, continuous improvement, long-term profitability focus. Gambling: random bets, no edge, hope-based, short-term thinking","Only about legality","About trade frequency","b","Traders who treat every trade as a business transaction with quantified risk and expected value consistently outperform those chasing excitement or emotional highs from 'big wins'."),
    q("m29","What is the DemonZeno trading philosophy?","Maximum leverage always","Master the chaos — understand market structure deeply, manage risk relentlessly, execute with discipline, and treat trading as a lifelong craft, not a get-rich-quick scheme","Trade every signal blindly","Copy others' trades","b","DemonZeno's philosophy: deep market knowledge + strict risk management + unemotional execution + continuous learning = the foundation of trading like a god in any market condition."),
    q("m30","What ultimately separates a master trader from everyone else?","Better indicators or tools","Complete mastery of self — the ability to execute a proven plan with perfect discipline and emotional neutrality across thousands of trades in any market condition","A larger account","Access to better data","b","The highest trading mastery is psychological. Your strategy can be simple. Your edge can be modest. But perfect execution with zero emotional interference over thousands of trades — that is what makes a master."),
    q("m31","What is the concept of 'probabilistic thinking' in trading?","Thinking about single trade outcomes","Understanding that each trade is one sample from a distribution — focusing on process and edge over a large sample rather than any individual outcome","A mathematical formula","A risk metric","b","Probabilistic thinking: a losing trade following all rules is a 'good trade'; a winning trade breaking rules is a 'bad trade'. What matters is the process, not individual outcomes."),
    q("m32","What is the significance of trader psychology vs. strategy?","Strategy is most important","Studies show psychology accounts for ~80% of trading success — a mediocre strategy executed perfectly beats a great strategy executed emotionally","Technology is most important","Capital size is the key factor","b","Most traders have adequate strategies but fail execution due to fear, greed, or impatience. Mastering psychological discipline is the highest-leverage improvement any trader can make."),
    q("m33","What is the concept of 'process over outcome' in trading?","Focus on winning every trade","Evaluate trades based on whether you followed your plan, not whether they won — consistent process execution over thousands of trades produces consistent results","Outcome defines quality","P&L is the only metric","b","Process focus: if you followed all rules but lost, it was a good trade. If you broke rules but won, it was a bad trade. This mindset builds the right habits for long-term success."),
    q("m34","What is self-directed learning vs. mentorship in trading development?","Self-study is always better","Both are valuable — self-directed backtesting and journaling build deep understanding; mentorship accelerates identification of blind spots and costly mistakes","Mentorship is the only path","Only formal courses matter","b","The ideal development path combines both: mentorship to avoid the most common expensive mistakes, and self-directed research to build genuine, deep understanding of your edge."),
    q("m35","What is 'scenario planning' before trading a session?","Random preparation","Identifying 2-3 specific scenarios before the session opens — 'if price does X, I do Y; if price does Z, I do W' — removing in-session decision pressure","Drawing charts","Checking news headlines","b","Pre-session scenario planning removes emotional decision-making during live markets — you've already decided what to do in each scenario, so execution becomes mechanical and calm."),
    q("m36","What is 'accepting randomness' in markets?","All price moves are predictable","Acknowledging that no edge is 100% — even perfect setups can lose due to unforeseen events. Focus on probability over certainty","A defeatist mindset","Ignoring risk management","b","Accepting randomness means knowing any single trade can lose for random reasons. Your edge only works over a large sample. This removes attachment to individual trade outcomes."),
    q("m37","What is a 'trading manifesto'?","A trading signal","A personal written document defining your trading philosophy, values, rules, goals, and the standards you hold yourself to — reviewed regularly","A broker agreement","A signal subscription","b","A trading manifesto is your professional contract with yourself — it defines who you are as a trader, what you stand for, and the standards you refuse to compromise on."),
    q("m38","What is the 'peak performance' state in trading?","Maximum position size","A calm, focused, alert mental state where decisions are clear, execution is disciplined, and emotions are managed — the opposite of emotional trading","Trading while tired","High-caffeine focus","b","Peak performance trading requires the same mental preparation as elite sport — adequate sleep, minimal stress, clear focus, structured routine, and the ability to detach emotionally from outcomes."),
    q("m39","What is the 'equity curve' and why does it matter?","Daily P&L chart","The running line chart of your account value over time — reveals the character of your strategy: trending up, volatile, max drawdown depth, recovery time","A trading signal","A volatility measure","b","Your equity curve tells the whole story — a smooth upward curve with shallow drawdowns signals a high-quality, stable edge. A jagged, erratic curve signals inconsistency or emotional trading."),
    q("m40","What is 'expectancy' as a trading metric?","Win rate only","The average profit or loss per trade when all trade outcomes are considered: (Win Rate × Avg Win) − (Loss Rate × Avg Loss)","Total P&L","Number of profitable trades","b","Positive expectancy means your system makes money on average over many trades — it's the core metric that tells you whether to trade a system live. Win rate alone is meaningless without it."),
    q("m41","What is the difference between alpha and beta in portfolio management?","Both measure return","Beta is market return; Alpha is excess return above beta — a measure of skill versus simply riding the market","Both measure risk","Alpha is leverage; Beta is risk","b","Beta = return from market exposure (no skill required); Alpha = return above the market benchmark (genuine skill). Most traders generate little to no alpha after fees."),
    q("m42","What is the concept of 'regime-switching' strategy management?","Trading in all conditions the same way","Actively monitoring market regime (trending/ranging/volatile/quiet) and switching strategy parameters or turning off strategies that don't fit","Using multiple indicators","A risk management approach","b","A trending regime favors trend-following (breakouts, momentum); a ranging regime favors mean-reversion (fade extremes). Deploying the wrong strategy in the wrong regime destroys edge."),
    q("m43","What is 'skin in the game' in trading philosophy (Nassim Taleb)?","Having large position sizes","Trading only with real money you can afford to lose — having real consequences that align your incentives with honest assessment of risk","A leverage concept","A type of account","b","Skin in the game ensures intellectual honesty — when real money is at risk, you cannot delude yourself about your edge. Paper trading or managing others' money without exposure creates moral hazard."),
    q("m44","What is the 'Lindy effect' applied to trading strategies?","New strategies are best","Strategies that have survived for a long time are more likely to continue working — older, simpler approaches often have more durable edge than recent complex ones","Complex is better","Newer patterns are more reliable","b","The Lindy effect: trend-following and price action strategies that have 'survived' for 50+ years are more likely to work than last year's backtested pattern. Durable edges are rare and simple."),
    q("m45","What defines a trader who has truly reached the master level?","Maximum account size","Complete integration of technical skill, risk management, self-mastery, business discipline, and continuous learning — executed consistently with no separation between plan and action","Access to premium tools","Years of trading experience only","b","A master trader is a complete professional: technically skilled, psychologically disciplined, business-minded, and perpetually learning. There is no 'arrived' — mastery is a practice, not a destination."),
  ] };

  // ── Public API ────────────────────────────────────────────────────────────

  public func isValidTier(tierId : Text) : Bool {
    tierId == "beginner" or tierId == "intermediate" or tierId == "advanced"
      or tierId == "expert" or tierId == "master";
  };

  // ── Per-question fail stat tracking ──────────────────────────────────────

  /// Record quiz breakdown against per-question fail stats.
  /// Called after every quiz attempt with the breakdown and selected question IDs.
  public func recordPerQuestionStats(
    failStats : List.List<Types.QuestionFailStat>,
    tierId    : Text,
    breakdown : [Types.QuizBreakdownItem],
    questionIds : [Text],
  ) {
    for (qId in questionIds.values()) {
      let wasCorrect = switch (breakdown.find(func(b) { b.questionId == qId })) {
        case (?b) b.correct;
        case null true; // unanswered counts as seen but not failed
      };
      switch (failStats.findIndex(func(s : Types.QuestionFailStat) : Bool { s.questionId == qId and s.tierId == tierId })) {
        case (?idx) {
          let existing = failStats.at(idx);
          failStats.put(idx, {
            existing with
            totalSeen = existing.totalSeen + 1;
            failCount = if (not wasCorrect) existing.failCount + 1 else existing.failCount;
          });
        };
        case null {
          failStats.add({
            questionId = qId;
            tierId;
            totalSeen = 1;
            failCount = if (not wasCorrect) 1 else 0;
          });
        };
      };
    };
  };

  // ── Tier disabled check ───────────────────────────────────────────────────

  public func isTierDisabled(
    disabledTiers : List.List<Types.TierDisabledEntry>,
    tierId        : Text,
  ) : Bool {
    switch (disabledTiers.find(func(e : Types.TierDisabledEntry) : Bool { e.tierId == tierId })) {
      case (?e) e.disabled;
      case null false;
    };
  };

  public func setTierDisabled(
    disabledTiers : List.List<Types.TierDisabledEntry>,
    tierId        : Text,
    disabled      : Bool,
  ) {
    switch (disabledTiers.findIndex(func(e : Types.TierDisabledEntry) : Bool { e.tierId == tierId })) {
      case (?idx) { disabledTiers.put(idx, { tierId; disabled }) };
      case null   { disabledTiers.add({ tierId; disabled }) };
    };
  };

  // ── Question flagging ─────────────────────────────────────────────────────

  /// Return a modified pool with isReviewFlagged toggled for the given questionId.
  public func flagQuestion(
    flaggedIds : List.List<Text>,
    questionId : Text,
    flagged    : Bool,
  ) {
    // We store flagged question IDs in a separate list (pool is immutable).
    if (flagged) {
      if (not flaggedIds.contains(questionId)) {
        flaggedIds.add(questionId);
      };
    } else {
      let filtered = flaggedIds.filter(func(id : Text) : Bool { id != questionId });
      flaggedIds.clear();
      flaggedIds.append(filtered);
    };
  };

  // ── Share token generation ────────────────────────────────────────────────

  /// Generate a unique 16-character share token for a certificate.
  public func generateShareToken(counter : Nat, certId : Text) : Text {
    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charsetSize : Nat = 62;
    let now : Nat = Int.abs(Time.now());
    var s = counter * 1_999_993 + now + certId.size() * 53;
    var result = "";
    var i = 0;
    while (i < 16) {
      let idx = s % charsetSize;
      let chars = charset.chars();
      var j = 0;
      var chosen = 'A';
      for (c in chars) {
        if (j == idx) { chosen := c };
        j := j + 1;
      };
      result := result # Text.fromChar(chosen);
      s := (s * 6_364_136_223 + 1_442_695_041) % 1_000_000_007;
      i := i + 1;
    };
    result;
  };

  public func tierName(tierId : Types.TierId) : Text {
    switch (tierId) {
      case "beginner"     "Beginner";
      case "intermediate" "Intermediate";
      case "advanced"     "Advanced";
      case "expert"       "Expert";
      case "master"       "Master";
      case _              tierId;
    };
  };

  /// Return the full 45-question pool for a tier.
  public func getQuizPool(tierId : Text) : ?[Types.QuizQuestion] {
    switch (tierId) {
      case "beginner"     ?beginnerQuestions();
      case "intermediate" ?intermediateQuestions();
      case "advanced"     ?advancedQuestions();
      case "expert"       ?expertQuestions();
      case "master"       ?masterQuestions();
      case _              null;
    };
  };

  /// Select 30 questions from a pool using a seed for deterministic randomisation,
  /// then shuffle the answer options of each selected question so correct answers
  /// are evenly distributed across A/B/C/D (not biased to any position).
  public func selectRandomQuestions(pool : [Types.QuizQuestion], seed : Int) : [Types.QuizQuestion] {
    let n = pool.size();
    if (n == 0) { return pool };
    // Build a mutable index array and Fisher-Yates shuffle
    let varIndices = Array.tabulate(n, func(i : Nat) : Nat { i }).toVarArray<Nat>();
    var s : Int = seed;
    var i = n;
    while (i > 1) {
      i := i - 1;
      s := (s * 6_364_136_223 + 1_442_695_041) % 1_000_000_007;
      let j = Int.abs(s) % (i + 1);
      let tmp = varIndices[i];
      varIndices[i] := varIndices[j];
      varIndices[j] := tmp;
    };
    let take = if (n < 30) n else 30;
    // For each selected question, shuffle its 4 answer options so the correct
    // answer lands at a truly random position (not always B).
    Array.tabulate<Types.QuizQuestion>(take, func(k) {
      let q = pool[varIndices[k]];
      shuffleOptions(q, s * 31 + k.toInt());
    });
  };

  /// Shuffle the 4 options of a question using a per-question seed so the
  /// correct answer is placed at a random A/B/C/D position.
  /// Shuffle the 4 options of a question using a per-question seed so the
  /// correct answer is placed at a random A/B/C/D position.
  func shuffleOptions(question : Types.QuizQuestion, seed : Int) : Types.QuizQuestion {
    // Find which original option text corresponds to the correct answer
    let correctText = switch (question.options.find(func(o) { o.id == question.correctOption })) {
      case (?o) o.text;
      case null "";
    };
    // Fisher-Yates shuffle on the 4 option texts (keep id labels fixed as a/b/c/d)
    let texts : [var Text] = [var question.options[0].text, question.options[1].text, question.options[2].text, question.options[3].text];
    var s = seed;
    var j = 4;
    while (j > 1) {
      j := j - 1;
      s := (s * 6_364_136_223 + 1_442_695_041) % 1_000_000_007;
      let k = Int.abs(s) % (j + 1);
      let tmp = texts[j];
      texts[j] := texts[k];
      texts[k] := tmp;
    };
    // Determine the new correct option id (whichever slot now holds correctText)
    var newCorrect = "a";
    let ids = ["a", "b", "c", "d"];
    var m = 0;
    while (m < 4) {
      if (texts[m] == correctText) { newCorrect := ids[m] };
      m := m + 1;
    };
    {
      question with
      options = [
        { id = "a"; text = texts[0] },
        { id = "b"; text = texts[1] },
        { id = "c"; text = texts[2] },
        { id = "d"; text = texts[3] },
      ];
      correctOption = newCorrect;
    };
  };

  /// Grade a quiz — compares answers against the selected 30 questions, returns result with 30/30 pass threshold.
  public func gradeQuiz(
    tierId  : Types.TierId,
    answers : [Types.QuizAnswer],
  ) : ?Types.QuizResult {
    switch (getQuizPool(tierId)) {
      case null null;
      case (?pool) {
        var score : Nat = 0;
        var breakdown : [Types.QuizBreakdownItem] = [];
        for (question in pool.values()) {
          let selected = switch (answers.find(func(a : Types.QuizAnswer) : Bool { a.questionId == question.id })) {
            case (?a) a.selectedOption;
            case null  "";
          };
          let correct = selected == question.correctOption;
          if (correct) { score := score + 1 };
          breakdown := breakdown.concat([{ questionId = question.id; correct }]);
        };
        ?{
          tierId;
          tierName = tierName(tierId);
          score;
          passed = score >= 30;
          breakdown;
        };
      };
    };
  };

  /// Track a quiz attempt for a given tier.
  public func trackAttempt(
    attemptStats : List.List<Types.QuizAttemptStats>,
    tierId       : Text,
    passed       : Bool,
  ) {
    switch (attemptStats.findIndex(func(s : Types.QuizAttemptStats) : Bool { s.tierId == tierId })) {
      case (?idx) {
        let existing = attemptStats.at(idx);
        attemptStats.put(idx, {
          existing with
          totalAttempts = existing.totalAttempts + 1;
          passCount = if (passed) existing.passCount + 1 else existing.passCount;
        });
      };
      case null {
        attemptStats.add({
          tierId;
          totalAttempts = 1;
          passCount = if (passed) 1 else 0;
        });
      };
    };
  };

  /// Generate a 9-character uppercase alphanumeric certificate ID.
  public func generateCertId(counter : Nat, fullName : Text, tierId : Text) : Text {
    let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charsetSize : Nat = 36;
    let now : Nat = Int.abs(Time.now());
    let seed = counter * 999_983 + now + fullName.size() * 31 + tierId.size() * 17;
    var result = "";
    var s = seed;
    var i = 0;
    while (i < 9) {
      let idx = s % charsetSize;
      let chars = charset.chars();
      var j = 0;
      var chosen = 'A';
      for (c in chars) {
        if (j == idx) { chosen := c };
        j := j + 1;
      };
      result := result # Text.fromChar(chosen);
      s := (s * 6_364_136_223 + 1_442_695_041) % 1_000_000_007;
      i := i + 1;
    };
    result;
  };
};
