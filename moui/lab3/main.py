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

def starting_phase_of_the_simplex_method(c_T, A, b_T):
    n = len(A)
    m = len(A[0])
    for i in range(len(A)): # Первый шаг
        if b_T[i] < 0:
            b_T[i] = -1 * b_T[i]
            A[i] = -1 * A[i]
    c_T_auxiliary = np.concatenate(np.zeros[n], np.full(m, -1)) # Второй шаг
    x_T_auxiliary = np.zeros(n + m)
    B = np.zeros(m, dtype=float)
    A_auxiliary = np.concatenate(A, np.identity(m))
    x_T_auxiliary = np.concatenate(np.zeros[n], b_T) # Третий шаг
    for i in range(n, n + m):
        B[i - n] = i
    main_phase_of_the_simplex_method(c_T_auxiliary, A_auxiliary, x_T_auxiliary, B) # Четвертый шаг
    for i in range(n, n + m): # Пятый шаг
        if x_T_auxiliary != 0:
            raise 'Задача несовместна'
    x_T = np.array(x_T_auxiliary[:m]) # Шестой шаг
    if np.all(B < n and B >= 0): # Седьмой шаг
        return (x_T, B)
    j_k = np.argmax(B) # Восьмой шаг
    l = np.zeros(n) # Девятый шаг
    while True:
        arr1 = np.array([i for i in range(n)])
        arr2 = np.array([elem for elem in arr1 if elem not in B])
        A_auxiliary_B_inversed = np.linalg.inv(A_auxiliary[:, B])
        for i in range(len(arr2)):
            l[arr2[i]] = np.dot(A_auxiliary_B_inversed, A_auxiliary[:, i])
            if

    
c_T = np.array([1, 0, 0], dtype=float)
A = np.array([[1, 1, 1], [2, 2, 2]], dtype=float)
b_T = np.array([0, 0], dtype=float)
print(starting_phase_of_the_simplex_method(c_T, A, b_T))