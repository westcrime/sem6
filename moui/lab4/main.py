import numpy as np

def dual_simplex_method(c_T, A, b_T, B):
    n = len(c_T)
    m = len(B)
    while True:
        A_B = A[:, B]
        A_B_inv = np.linalg.inv(A_B) # Первый шаг
        c_T_B = c_T[B] # Второй шаг
        y_T = np.dot(c_T_B, A_B_inv) # Третий шаг
        k = np.concatenate([np.dot(A_B_inv, b_T), np.zeros(n - m)]) # Четвертый шаг
        if np.all(k >= 0): # Пятый шаг
            return y_T
        negative_indices = np.where(k < 0) # Шестой шаг
        j_k = negative_indices[0][0]
        d_y_T = A_B_inv[:, j_k] # Седьмой шаг
        u = np.zeros(n)
        for i in range(n): # Седьмой шаг
            if i not in B:
                u[i] = np.dot(d_y_T, A[:, i])
        if np.all(u >= 0): # Восьмой шаг
            raise 'Прямая задача не совместна'
        sigma = np.zeros(n)
        sigmas = np.zeros(m)
        for i in range(n): # Девятый шаг
            if i not in B:
                sigma[i] = (c_T[i] - np.dot(A[:, i], y_T)) / u[i]
                np.append(sigmas, sigma[i])
        sigma_0 = np.min(sigmas) 
        j_0 = np.where(sigma == sigma_0) # Десятый шаг
        B[k] = j_0 # Одиннадцатый шаг

c_T = np.array([-4, -3, -7, 0, 0], dtype=float)
A = np.array([[-2, -1, -4, 1, 0], [-2, -2, -2, 0, 1]], dtype=float)
b_T = np.array([-1, -1.5], dtype=float)
B = np.array([4 - 1, 5 - 1], dtype=int)
print(dual_simplex_method(c_T, A, b_T, B))    