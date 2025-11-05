export const getTodayRevenue = (orders) => {
  const today = new Date().toISOString().split('T')[0];
  return orders
    .filter(order => 
      order.status === 'completed' && 
      order.completedAt?.startsWith(today)
    )
    .reduce((sum, order) => sum + order.total, 0);
};

export const getMonthlyRevenue = (orders, year, month) => {
  return orders
    .filter(order => {
      if (order.status !== 'completed' || !order.completedAt) return false;
      const date = new Date(order.completedAt);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .reduce((sum, order) => sum + order.total, 0);
};

export const getYearlyRevenue = (orders, year) => {
  return orders
    .filter(order => {
      if (order.status !== 'completed' || !order.completedAt) return false;
      return new Date(order.completedAt).getFullYear() === year;
    })
    .reduce((sum, order) => sum + order.total, 0);
};

export const getBestSellingProducts = (orders, products) => {
  const productSales = {};
  
  orders
    .filter(order => order.status === 'completed')
    .forEach(order => {
      order.items.forEach(item => {
        const productId = item.productId || item.id;
        if (!productSales[productId]) {
          productSales[productId] = { quantity: 0, revenue: 0 };
        }
        productSales[productId].quantity += item.quantity || 1;
        productSales[productId].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

  return Object.entries(productSales)
    .map(([productId, data]) => {
      const product = products.find(p => p.id === parseInt(productId));
      return {
        productId: parseInt(productId),
        name: product?.name || 'Unknown',
        quantity: data.quantity,
        revenue: data.revenue,
      };
    })
    .sort((a, b) => b.quantity - a.quantity);
};

export const getAllMonthsData = (orders) => {
  const months = [];
  const currentYear = new Date().getFullYear();
  
  for (let month = 0; month < 12; month++) {
    const revenue = getMonthlyRevenue(orders, currentYear, month);
    months.push({
      month: month + 1,
      monthName: new Date(currentYear, month, 1).toLocaleString('th-TH', { month: 'long' }),
      revenue,
      year: currentYear,
      monthIndex: month,
    });
  }
  
  return months;
};

export const getAllYearsData = (orders) => {
  const yearsData = {};
  
  orders
    .filter(order => order.status === 'completed' && order.completedAt)
    .forEach(order => {
      const year = new Date(order.completedAt).getFullYear();
      if (!yearsData[year]) {
        yearsData[year] = 0;
      }
      yearsData[year] += order.total;
    });
  
  return Object.entries(yearsData)
    .map(([year, revenue]) => ({
      year: parseInt(year),
      yearName: `ปี ${year}`,
      revenue,
    }))
    .sort((a, b) => a.year - b.year);
};

export const getDailyRevenueForMonth = (orders, year, month) => {
  const dailyRevenue = {};
  
  orders
    .filter(order => {
      if (order.status !== 'completed' || !order.completedAt) return false;
      const date = new Date(order.completedAt);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .forEach(order => {
      const date = new Date(order.completedAt);
      const dayKey = date.getDate();
      if (!dailyRevenue[dayKey]) {
        dailyRevenue[dayKey] = {
          date: date,
          day: dayKey,
          revenue: 0,
          orderCount: 0,
        };
      }
      dailyRevenue[dayKey].revenue += order.total;
      dailyRevenue[dayKey].orderCount += 1;
    });
  
  return Object.values(dailyRevenue)
    .sort((a, b) => b.day - a.day)
    .map(item => ({
      ...item,
      dateString: item.date.toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }),
    }));
};

