const dashboardConfigs = {
    // Core Analytics Dashboard Stats
    coreStats: {
      id: 'core-analytics',
      layout: { columns: 4, gap: '1rem' },
      statistics: [
        // Revenue Overview Card
        {
          id: 'revenue-overview',
          resourceName: 'orders',
          displayType: 'card',
          layout: {
            rows: 2,
            columns: 2,
            fields: {
              totalRevenue: { 
                rowStart: 1, 
                colStart: 1, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Total Revenue',
                format: 'currency'
              },
              orderCount: { 
                rowStart: 1, 
                colStart: 2, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Total Orders',
                format: 'number'
              },
              avgOrderValue: { 
                rowStart: 2, 
                colStart: 1, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Average Order',
                format: 'currency'
              },
              growth: { 
                rowStart: 2, 
                colStart: 2, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Growth',
                format: 'percentage'
              }
            }
          }
        },
  
        // Revenue Trend Chart
        {
          id: 'revenue-trend',
          resourceName: 'orders',
          displayType: 'chart',
          requestType: 'timeSeriesAnalysis',
          chartType: 'area',
          title: 'Revenue Trend',
          xAxis: 'Date',
          yAxis: 'Revenue ($)',
          colors: ['#4CAF50'],
          params: {
            timeFrame: 'daily',
            method: 'sum',
            fieldName: 'amount'
          }
        }
      ]
    },
  
    // Product Analytics Dashboard
    productAnalytics: {
      id: 'product-insights',
      layout: { columns: 3, gap: '1.5rem' },
      statistics: [
        // Top Products Chart
        {
          id: 'top-products',
          resourceName: 'products',
          displayType: 'chart',
          requestType: 'calculate',
          chartType: 'bar',
          title: 'Top 10 Products',
          xAxis: 'Product',
          yAxis: 'Units Sold',
          colors: ['#2196F3'],
          params: {
            limit: 10,
            sortBy: 'sales',
            order: 'desc'
          }
        },
  
        // Category Distribution
        {
          id: 'category-dist',
          resourceName: 'products',
          displayType: 'chart',
          requestType: 'fieldOccurrences',
          chartType: 'pie',
          title: 'Category Distribution',
          showLabels: true,
          colors: ['#FF9800', '#F44336', '#9C27B0', '#3F51B5', '#009688'],
          params: {
            fieldName: 'category'
          }
        },
  
        // Product Ratings
        {
          id: 'product-ratings',
          resourceName: 'reviews',
          displayType: 'chart',
          requestType: 'fieldOccurrences',
          chartType: 'donut',
          title: 'Product Ratings',
          colors: ['#4CAF50', '#8BC34A', '#FFEB3B', '#FF9800', '#F44336'],
          params: {
            fieldName: 'rating'
          }
        }
      ]
    },
  
    // Customer Insights Dashboard
    customerInsights: {
      id: 'customer-analytics',
      layout: { columns: 2, gap: '1rem' },
      statistics: [
        // Customer Lifetime Value
        {
          id: 'customer-ltv',
          resourceName: 'users',
          displayType: 'chart',
          requestType: 'calculate',
          chartType: 'scatter',
          title: 'Customer Lifetime Value',
          xAxis: 'Time as Customer (months)',
          yAxis: 'Total Spend ($)',
          colors: ['#E91E63'],
          params: {
            calculate: 'ltv'
          }
        },
  
        // Purchase Frequency
        {
          id: 'purchase-frequency',
          resourceName: 'orders',
          displayType: 'chart',
          requestType: 'calculate',
          chartType: 'bar',
          title: 'Purchase Frequency',
          xAxis: 'Orders per Month',
          yAxis: 'Number of Customers',
          colors: ['#673AB7'],
          params: {
            groupBy: 'user',
            calculate: 'frequency'
          }
        }
      ]
    },
  
    // Inventory Management Dashboard
    inventoryManagement: {
      id: 'inventory-analytics',
      layout: { columns: 2, gap: '1rem' },
      statistics: [
        // Stock Levels
        {
          id: 'stock-levels',
          resourceName: 'products',
          displayType: 'chart',
          requestType: 'fieldOccurrences',
          chartType: 'heatmap',
          title: 'Stock Levels by Category',
          colors: ['#E3F2FD', '#2196F3', '#0D47A1'],
          params: {
            groupBy: ['category', 'stockLevel']
          }
        },
  
        // Low Stock Alerts
        {
          id: 'low-stock',
          resourceName: 'products',
          displayType: 'card',
          layout: {
            rows: 1,
            columns: 3,
            fields: {
              productName: { 
                rowStart: 1, 
                colStart: 1, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Product'
              },
              currentStock: { 
                rowStart: 1, 
                colStart: 2, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Current Stock'
              },
              reorderPoint: { 
                rowStart: 1, 
                colStart: 3, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Reorder Point'
              }
            }
          },
          params: {
            filter: 'lowStock'
          }
        }
      ]
    },
  
    // Payment Analytics Dashboard
    paymentAnalytics: {
      id: 'payment-insights',
      layout: { columns: 3, gap: '1rem' },
      statistics: [
        // Payment Methods Distribution
        {
          id: 'payment-methods',
          resourceName: 'payments',
          displayType: 'chart',
          requestType: 'fieldOccurrences',
          chartType: 'pie',
          title: 'Payment Methods',
          colors: ['#00BCD4', '#009688', '#4CAF50', '#8BC34A'],
          params: {
            fieldName: 'paymentMethod'
          }
        },
  
        // Transaction Success Rate
        {
          id: 'transaction-success',
          resourceName: 'payments',
          displayType: 'chart',
          requestType: 'calculate',
          chartType: 'radialBar',
          title: 'Transaction Success Rate',
          colors: ['#4CAF50'],
          params: {
            calculate: 'successRate'
          }
        },
  
        // Payment Timeline
        {
          id: 'payment-timeline',
          resourceName: 'payments',
          displayType: 'chart',
          requestType: 'timeSeriesAnalysis',
          chartType: 'line',
          title: 'Payment Volume Over Time',
          xAxis: 'Date',
          yAxis: 'Number of Transactions',
          colors: ['#3F51B5'],
          params: {
            timeFrame: 'daily',
            method: 'count'
          }
        }
      ]
    },
  
    // Shop Performance Dashboard
    shopPerformance: {
      id: 'shop-analytics',
      layout: { columns: 2, gap: '1.5rem' },
      statistics: [
        // Shop Revenue Comparison
        {
          id: 'shop-revenue',
          resourceName: 'shops',
          displayType: 'chart',
          requestType: 'calculate',
          chartType: 'bar',
          title: 'Shop Revenue Comparison',
          xAxis: 'Shop',
          yAxis: 'Revenue ($)',
          colors: ['#FF5722'],
          params: {
            method: 'sum',
            fieldName: 'revenue'
          }
        },
  
        // Shop Growth Metrics
        {
          id: 'shop-growth',
          resourceName: 'shops',
          displayType: 'card',
          layout: {
            rows: 2,
            columns: 2,
            fields: {
              monthlyGrowth: { 
                rowStart: 1, 
                colStart: 1, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Monthly Growth',
                format: 'percentage'
              },
              newCustomers: { 
                rowStart: 1, 
                colStart: 2, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'New Customers',
                format: 'number'
              },
              repeatCustomers: { 
                rowStart: 2, 
                colStart: 1, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Repeat Customers',
                format: 'number'
              },
              averageRating: { 
                rowStart: 2, 
                colStart: 2, 
                rowSpan: 1, 
                colSpan: 1,
                title: 'Average Rating',
                format: 'decimal'
              }
            }
          }
        }
      ]
    }
  };
  
  // Role-based dashboard configurations
  const dashboardsByRole = {
    admin: [
      dashboardConfigs.coreStats,
      dashboardConfigs.productAnalytics,
      dashboardConfigs.customerInsights,
      dashboardConfigs.paymentAnalytics
    ],
    
    shopOwner: [
      dashboardConfigs.shopPerformance,
      dashboardConfigs.inventoryManagement,
      dashboardConfigs.productAnalytics
    ],
    
    analyst: [
      dashboardConfigs.customerInsights,
      dashboardConfigs.productAnalytics,
      dashboardConfigs.paymentAnalytics
    ]
  };
  
  export { dashboardConfigs, dashboardsByRole };