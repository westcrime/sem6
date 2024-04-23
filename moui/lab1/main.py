import numpy as np

def fast_inversion(A_inv, x, i):
    
# first step
    l = np.dot(A_inv, x)

    if l[i] == 0:
        raise Exception("Matrix is not inversible")
    
# second - third step
    tmp = l[i]
    l[i] = -1
    l *= -1 / tmp

# fourth - fifth step
    result = np.empty(A_inv.shape)
    for (rowIndex, row) in enumerate(A_inv):
        for (colIndex, element) in enumerate(row):
            result[rowIndex, colIndex] = A_inv[i, colIndex] * l[rowIndex]
            if rowIndex != i:
                result[rowIndex, colIndex] += element
    
    return result