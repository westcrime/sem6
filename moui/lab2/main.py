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

def main_phase_of_the_simplex_method(c_T, A, x_T, B):
    iteration = 1
    k = 0
    A_B_inversed = 0
    while True:
        A_B = A[:, B] # Первый шаг
        if iteration > 1:
            A_B_inversed = fast_inversion(A_B_inversed, A_B[:, k], k)
        else:
            A_B_inversed = np.linalg.inv(A_B)
        c_B_T = c_T[B] # Второй шаг
        u_T = np.dot(c_B_T, A_B_inversed) # Третий шаг
        grade_vector_T = np.dot(u_T, A) - c_T  # Четвертый шаг
        if np.all(grade_vector_T >= 0): # Пятый шаг
            return x_T
        negative_indices = np.where(grade_vector_T < 0) # Шестой шаг
        j_0 = negative_indices[0][0]
        z = np.dot(A_B_inversed, A[:, j_0]) # Седьмой шаг
        O_T = np.zeros(len(A)) # Восьмой шаг
        for i in range(len(A)):
            if z[i] > 0:
                O_T[i] = x_T[B[i]] / z[i]
            else:
                O_T[i] = np.inf
        if np.all(O_T == np.inf):
            return 'Целевой функционал задачи не ограничен сверху на множестве допустимых планов.' # Десятый шаг
        O_0 = O_T[0]
        j_star = 0
        for i in range(len(O_T)): # Девятый и одиннадцатый шаг
            if O_T[i] != np.inf:
                if O_T[i] < O_0:
                    O_0 = O_T[i]
                    j_star = B[i]
                    k = i
        B[k] = j_0 # Двенадцатый шаг
        x_T[j_0] = O_0 # Тринадцатый шаг
        for i in range(len(A)):
            if (i != k):
                x_T[B[i]] = x_T[B[i]] - O_0 * z[i]
        x_T[j_star] = 0
        iteration += 1

c_T = np.array([1, 1, 0, 0, 0], dtype=float)
A = np.array([[-1, 1, 1, 0, 0], [1, 0, 0, 1, 0], [0, 1, 0, 0, 1]], dtype=float)
x_T = np.array([0, 0, 1, 3, 2], dtype=float)
B = ([3-1, 4-1, 5-1])
print(main_phase_of_the_simplex_method(c_T, A, x_T, B))