/* components/WhitelistBox.js */
import React, { useState, useEffect, useRef } from 'react';
import { useSwitchChain, useAccount, useChainId, useConnect } from 'wagmi';
import { ethers } from 'ethers';
import { metaMask } from '@wagmi/connectors';
import confetti from 'canvas-confetti';
import styles from './WhitelistBox.module.css';

const DAY_MS = 24 * 60 * 60 * 1000;

const WhitelistBox = () => {
  const WHITELIST_START = new Date('2025-06-29T21:52:00Z').getTime();
  const WHITELIST_END = new Date('2025-09-03T16:50:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState('');
  const [joined, setJoined] = useState(3);
  const [currency, setCurrency] = useState('BNB');
  const [bnbAmount, setBnbAmount] = useState('0.008');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const canvasRef = useRef(null);

  const { switchChainAsync } = useSwitchChain();
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { connectAsync } = useConnect();

  const recipientAddress = '0x7cd14dd705f5e05d8b1b9853245cc60bd8251ff4';
  const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
  const USDT_ABI = [
    'function transfer(address to, uint amount) public returns (bool)',
    'function balanceOf(address account) public view returns (uint256)',
  ];

  useEffect(() => {
    const fetchBnbPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
        if (!res.ok) throw new Error('Failed to fetch BNB price.');
        const data = await res.json();
        const price = data.binancecoin.usd;
        setBnbAmount((5 / price).toFixed(6));
      } catch {
        alert('Failed to fetch BNB price. Please try again later.');
        setBnbAmount('--');
      }
    };
    fetchBnbPrice();
  }, []);

  useEffect(() => {
    const getTimeLeft = () => {
      const now = Date.now();
      if (now >= WHITELIST_END) {
        return 'Whitelist has ended!';
      }

      const diff = Math.max(0, WHITELIST_END - now);
      const days = Math.floor(diff / DAY_MS);
      const hrs = Math.floor((diff % DAY_MS) / (60 * 60 * 1000));
      const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const secs = Math.floor((diff % (60 * 1000)) / 1000);

      return `${days}d ${hrs}h ${mins}m ${secs}s`;
    };

    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === 'Whitelist has ended!') {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const whitelistBox = document.querySelector(`.${styles['whitelist-box']}`);
    if (!whitelistBox) return;

    const colors = ['cyan', 'yellow', 'green', 'pink'];
    let interval;
    const startConfetti = () => {
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          for (let i = 0; i < 3; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add(styles.confetti);
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.classList.add(styles[`confetti-${randomColor}`]);
            const width = Math.random() * 8 + 8;
            const height = Math.random() * 4 + 2;
            confetti.style.width = `${width}px`;
            confetti.style.height = `${height}px`;
            const boxWidth = whitelistBox.offsetWidth;
            confetti.style.left = `${Math.random() * boxWidth}px`;
            confetti.style.top = '0px';
            confetti.style.animationDuration = `${Math.random() * 2 + 4}s`;
            whitelistBox.appendChild(confetti);
            confetti.addEventListener('animationend', () => confetti.remove());
          }
        }
      }, 300);
    };

    startConfetti();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!interval) startConfetti();
      } else {
        clearInterval(interval);
        interval = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    const myConfetti = confetti.create(canvas, { resize: true });

    let interval;
    const startFirework = () => {
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          myConfetti({
            particleCount: 75, // 50 yerine 75, daha belirgin ama hala optimize
            spread: 70,
            startVelocity: 30,
            origin: { x: Math.random(), y: 0.9 },
            colors: ['#00c9ff', '#ffcc00', '#92fe9d', '#ff69b4'],
            angle: 90,
            drift: Math.random() * 0.4 - 0.2,
            ticks: 150,
          });
        }
      }, 1000); // 1500ms yerine 1000ms, daha sık patlama
    };

    startFirework();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!interval) startFirework();
      } else {
        clearInterval(interval);
        interval = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const joinWhitelist = async () => {
    if (!window.ethereum) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        alert('Redirecting to MetaMask app...');
        window.location.href = 'https://metamask.app.link/dapp/' + window.location.host;
      } else {
        alert('MetaMask not detected. Please install MetaMask and try again.');
      }
      return;
    }

    setLoading(true);
    setStatus('Connecting wallet...');

    try {
      if (!isConnected || !address) {
        await connectAsync({ connector: metaMask() });
        setStatus('Wallet connected, checking network...');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (chainId !== 56) {
        setStatus('Switching to BSC network...');
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });
        let attempts = 0;
        let net = await provider.getNetwork();
        while (net.chainId !== 56n && attempts < 5) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          net = await provider.getNetwork();
          attempts++;
        }
        if (net.chainId !== 56n) throw new Error('Network switch failed');
      }

      setStatus('Checking balance...');
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice ?? ethers.parseUnits('5', 'gwei');

      if (currency === 'BNB') {
        const balance = await provider.getBalance(address);
        const requiredAmount = ethers.parseEther(bnbAmount);
        const gasEstimate = await provider.estimateGas({
          to: recipientAddress,
          value: requiredAmount,
        });
        const gasCost = gasPrice * BigInt(gasEstimate);
        const totalRequired = requiredAmount + gasCost;

        if (balance < totalRequired) {
          throw new Error(`Insufficient BNB balance. Required: ${ethers.formatEther(totalRequired)} BNB, Available: ${ethers.formatEther(balance)} BNB.`);
        }

        setStatus(`Sending BNB (~${ethers.formatEther(gasCost)} BNB gas fee)`);
        const tx = await signer.sendTransaction({
          to: recipientAddress,
          value: requiredAmount,
          gasLimit: gasEstimate,
          gasPrice,
        });
        setStatus('Awaiting transaction confirmation...');
        await tx.wait();
      } else if (currency === 'USDT') {
        const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
        const balance = await usdtContract.balanceOf(address);
        const requiredAmount = ethers.parseUnits('5', 18);
        const gasEstimate = await usdtContract.estimateGas.transfer(recipientAddress, requiredAmount);
        const gasCost = gasPrice * BigInt(gasEstimate);
        const bnbBalance = await provider.getBalance(address);

        if (balance < requiredAmount) {
          throw new Error(`Insufficient USDT balance. Required: 5 USDT, Available: ${ethers.formatUnits(balance, 18)} USDT.`);
        }
        if (bnbBalance < gasCost) {
          throw new Error(`Insufficient BNB for gas fees. Required: ${ethers.formatEther(gasCost)} BNB.`);
        }

        setStatus(`Sending USDT (~${ethers.formatEther(gasCost)} BNB gas fee)`);
        const transferTx = await usdtContract.transfer(recipientAddress, requiredAmount, {
          gasLimit: gasEstimate,
          gasPrice,
        });
        setStatus('Awaiting transaction confirmation...');
        await transferTx.wait();
      }

      setJoined((prev) => prev + 1);
      setSuccess(true);
      setStatus('Payment successful!');
      setTimeout(() => {
        setSuccess(false);
        setStatus('');
      }, 5000);
    } catch (error) {
      console.error('Transaction error:', error.message);
      if (error.code === 4001 && error.message.includes('wallet_switchEthereumChain')) {
        alert('Network switch rejected. Please switch to BSC in MetaMask.');
      } else if (error.code === 4001) {
        alert('Wallet connection rejected.');
      } else if (error.message.includes('Network switch failed')) {
        alert(`Network switch error: ${error.message}`);
      } else if (error.message.includes('Connection error')) {
        alert(`Connection error: ${error.message}`);
      } else {
        alert('Transaction failed or was canceled. Please check your wallet.');
      }
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className={styles['whitelist-box']}>
      <h2 className={styles['whitelist-heading']}>WHITELIST IS LIVE</h2>
      <p className={styles['fomo-message']}>Whitelist now for early access & guaranteed airdrop. Don’t miss the launch edge. 🎁</p>
      {timeLeft === 'Whitelist has ended!' ? (
        <p className={styles['time-left']}>Whitelist has ended!</p>
      ) : (
        <p className={styles['time-left']}>
          <span className={styles['time-numbers']}>{timeLeft}</span>
        </p>
      )}
      <p className={styles['presale-info']}>
        ⏳ Countdown ends. Presale begins.
      </p>
      <div className={styles['currency-selector']}>
        <button
          className={`${styles['bnb-button']} ${currency === 'BNB' ? styles['bnb-active'] : ''}`}
          onClick={() => setCurrency('BNB')}
          disabled={loading}
        >
          BNB
        </button>
        <button
          className={`${styles['usdt-button']} ${currency === 'USDT' ? styles['usdt-active'] : ''}`}
          onClick={() => setCurrency('USDT')}
          disabled={loading}
        >
          USDT
        </button>
      </div>
      <p className={styles['price-info']}>{currency === 'BNB' ? `${bnbAmount} BNB - 5 USD` : '5 USDT - 5 USD'}</p>
      <button
        className={styles['join-btn']}
        onClick={joinWhitelist}
        disabled={loading || (currency === 'BNB' && bnbAmount === '--')}
      >
        {loading ? status : 'Join Now'}
      </button>
      <p className={styles['join-fomo-message']}>
        Whitelist participants get early access to airdrops and discounted presale. Entries will close when the countdown
        ends – and the presale begins immediately. 📄
      </p>
      <canvas ref={canvasRef} className={styles['fireworks-canvas']} />
      {success && <p className={styles['whitelist-paragraph']} style={{ color: 'limegreen', fontWeight: 'bold', marginTop: '10px' }}>
        Successful transaction!
      </p>}
    </div>
  );
};

export default WhitelistBox;