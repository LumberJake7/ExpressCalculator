const express = require("express");
const app = express();
const CalcError = require("./CalcError");

app.get("/mean", handleMean);
app.get("/median", handleMedian);
app.get("/mode", handleMode);

function mean(nums) {
  const sum = nums.reduce((acc, val) => acc + val, 0);
  return sum / nums.length;
}

function median(nums) {
  nums.sort((a, b) => a - b);
  const mid = Math.floor(nums.length / 2);
  return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

function mode(nums) {
  const freq = {};
  let maxFreq = 0;
  let modes = [];

  nums.forEach((num) => {
    if (freq[num]) freq[num]++;
    else freq[num] = 1;
    if (freq[num] > maxFreq) {
      maxFreq = freq[num];
      modes = [num];
    } else if (freq[num] === maxFreq) {
      modes.push(num);
    }
  });

  return modes.length === 1 ? modes[0] : modes;
}

function parseNumbers(nums) {
  if (!nums) return new Error("No numbers provided");

  const numbers = nums.split(",").map((num) => {
    const parsed = parseFloat(num);
    if (isNaN(parsed)) {
      return new Error(`Invalid number: ${num}`);
    }
    return parsed;
  });

  const firstError = numbers.find((num) => num instanceof Error);
  if (firstError) {
    return firstError;
  }

  return numbers;
}

function handleMean(req, res, next) {
  if (!req.query.nums) {
    return next(new CalcError("Only Insert Numbers", 400));
  }

  const nums = parseNumbers(req.query.nums);
  if (nums instanceof Error) {
    return next(new CalcError(nums.message, 400));
  }

  try {
    const result = mean(nums);
    res.json({ operation: "mean", value: result });
  } catch (error) {
    next(
      new CalcError("Failed to calculate mean due to an unexpected error.", 500)
    );
  }
}
function handleMedian(req, res, next) {
  if (!req.query.nums) {
    return next(new CalcError("Only Insert Numbers", 400));
  }

  const nums = parseNumbers(req.query.nums);
  if (nums instanceof Error) {
    return next(new CalcError(nums.message, 400));
  }

  try {
    const result = median(nums);
    res.json({ operation: "median", value: result });
  } catch (error) {
    next(
      new CalcError(
        "Failed to calculate median due to an unexpected error.",
        500
      )
    );
  }
}
function handleMode(req, res, next) {
  if (!req.query.nums) {
    return next(new CalcError("Only Insert Numbers", 400));
  }

  const nums = parseNumbers(req.query.nums);
  if (nums instanceof Error) {
    return next(new CalcError(nums.message, 400));
  }

  try {
    const result = mode(nums);
    res.json({ operation: "mode", value: result });
  } catch (error) {
    next(
      new CalcError("Failed to calculate mode due to an unexpected error.", 500)
    );
  }
}

app.use((err, req, res, next) => {
  if (err instanceof CalcError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
