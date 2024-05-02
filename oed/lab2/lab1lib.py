import matplotlib.pyplot as plt
import numpy as np
import scipy as sp
import csv
import math
from functools import reduce
from enum import IntEnum, auto
from decimal import Decimal



class StandartDistribution(IntEnum):
    POISSON = auto()
    BINOMIAL = auto()
    GEOMETRIC = auto()
    NORMAL = auto()
    UNIFORM = auto()
    EXPONENTIAL = auto()



def clear_left(sorted_distribution, vals_part, width_part, cut_coeff):
    
    while True:
        vals_count = int(len(sorted_distribution) * vals_part)

        distribution_width = sorted_distribution[-1] - sorted_distribution[0]
        shorted_part_width = sorted_distribution[vals_count] - sorted_distribution[0]
        shorted_part = shorted_part_width / distribution_width

        if shorted_part < width_part: 
            return sorted_distribution

        trash_sep_width = shorted_part_width / vals_count * cut_coeff

        for i in range(vals_count):
            left_width_diff = sorted_distribution[vals_count - i] - sorted_distribution[vals_count - i - 1]

            if abs(left_width_diff) > abs(trash_sep_width):
                sorted_distribution = sorted_distribution[vals_count - i :]
                break

    return sorted_distribution


def clear(sorted_distribution, vals_part, width_part, cut_coeff):
    sorted_distribution = clear_left(sorted_distribution, vals_part, width_part, cut_coeff)
    sorted_distribution = clear_left(sorted_distribution[::-1], vals_part, width_part, cut_coeff)[::-1]

    return sorted_distribution


def get_x_axis(sorted_distribution, step):
    x_start = sorted_distribution[0] // step * step
    if x_start >= sorted_distribution[0]:
        x_start -= step

    current = x_start
    result = []

    while current <= sorted_distribution[-1]:
        result.append(current)
        current += step

    return result


def get_heights(x_axis, sorted_distribution):
    heights = [0] * len(x_axis)
    current_index = len(x_axis) - 1

    for value in reversed(sorted_distribution):
        if value > x_axis[current_index]:
            heights[current_index] += 1
        else:
            if value == x_axis[current_index]:
                heights[current_index] += 0.5
                heights[current_index - 1] += 0.5
            current_index -= 1
    
    return heights


def get_expected_value(distribution):
    return reduce(lambda x, y: x + y, distribution) / len(distribution)


def get_variance(distribution, expected_value):
    return reduce(lambda x, y: x + y * y, distribution, 0) / len(distribution) - expected_value ** 2


def lower_count(sorted_distribution, value):
    if len(sorted_distribution) == 0:
        return 0

    median = len(sorted_distribution) // 2

    if sorted_distribution[median] <= value:
        return median + 1 + lower_count(sorted_distribution[median + 1 :], value)
    else:
        return lower_count(sorted_distribution[: median], value)


def distribution_function(sorted_distribution, value):
    return lower_count(sorted_distribution, value) / len(sorted_distribution)


def read_csv(filepath):
    with open(filepath) as file:
        reader = csv.reader(file, quoting=csv.QUOTE_NONNUMERIC)
        result = []
        for row in reader:
            result += row
    return result


def get_geometric_p_by_expected_value(expected_value):
    return 1 / expected_value


def get_geometric_p_by_variance(variance):
    return (-1 + (1 + 4 * variance) ** 0.5) / 2 / variance


def get_binomial_p_by_expected_value(expected_value, n):
    return expected_value / n


def get_binomial_p_by_variance(variance, n, switch = False):
    p = (n - (n ** 2 - 4 * n * variance) ** 0.5) / 2 / n

    if switch:
        return 1 - p
    else:
        return p


def get_uniform_low_high(expected_value, variance):
    high = (3 * variance) ** 0.5 + expected_value
    low = 2 * expected_value - high
    return low, high


def draw_hist(cleared_sorted_distribution, step):
    x_axis = get_x_axis(cleared_sorted_distribution, step)
    heights = get_heights(x_axis, cleared_sorted_distribution)

    plt.bar([value + step / 2 for value in x_axis], heights, step)


def draw_distribution_plot(sorted_distribution, density):
    left_border = math.floor(sorted_distribution[0])
    right_border = math.ceil(sorted_distribution[-1])

    xs = np.linspace(left_border, right_border, density)
    ys = [distribution_function(sorted_distribution, x) for x in xs]

    plt.plot(xs, ys)


def draw_plot(function, density, low, high):
    xs = np.linspace(low, high, density)
    ys = [function(x) for x in xs]

    plt.plot(xs, ys)


def get_distribution_function_t(sorted_distribution):

    def distribution_function_t(value):
        return distribution_function(sorted_distribution, value)

    return distribution_function_t


def get_geometric_distribution_function(p):

    def geometric_distribution_function(value):
        return 1 - (1 - p) ** value
    
    return geometric_distribution_function


def get_binomial_distribution_function(p, n):

    def binomial_distribution_function(value):
        value = int(math.floor(value))
        return float(sum([Decimal(math.comb(n, k)) * Decimal(p) ** k * Decimal(1 - p) ** (n - k) for k in range(value + 1)]))

    return binomial_distribution_function


def get_poisson_distribution_function(mode):

    def poisson_distribution_function(value):
        value = int(math.floor(value))
        return math.exp(-mode)*float(sum([Decimal(mode) ** k / Decimal(math.factorial(k)) for k in range(value + 1)]))

    return poisson_distribution_function


def get_uniform_distribution_function(low, high):

    def uniform_distribution_function(value):
        return (value - low) / (high - low) if low <= value <= high else 0 if value < low else 1

    return uniform_distribution_function


def get_normal_distribution_function(mode, sd):

    def normal_distribution_function(value):
        return 0.5 * (1 + math.erf((value - mode) / (sd * np.sqrt(2))))
    
    return normal_distribution_function


def get_exponential_distribution_function(p):

    def expontnential_distribution_function(value):
        if value < 0:
            return 0
        return 1 - math.exp(-1 / p * value)

    return expontnential_distribution_function


def approximate(sorted_distribution, window):
    result = []

    for i in range(len(sorted_distribution) - window + 1):
        avg = sum(sorted_distribution[i : i + window]) / window
        result.append(avg)

    return result


def get_colmogorov_statistics(first_function, second_function, distribution):
    diff = np.max([np.abs(first_function(value) - second_function(value)) for value in distribution])
    return np.sqrt(len(distribution)) * diff


def get_p_value(k_statistics):
    max_iter = 1000000
    
    result = 0
    for k in range(1, max_iter + 1):
        term = (-1) ** (k - 1) * np.exp(-2 * k ** 2 * k_statistics ** 2)
        result += term
    
    return result * 2


def is_correct(p_value, alpha):
    return p_value >= alpha


def generate_distributions(sorted_distribution):
    result = {}
    
    mode = get_expected_value(sorted_distribution)
    variance = get_variance(sorted_distribution, mode)
    standart_deviation = variance ** 0.5

    result[StandartDistribution.POISSON] = get_poisson_distribution_function(mode)
    result[StandartDistribution.NORMAL] = get_normal_distribution_function(mode, standart_deviation)
    result[StandartDistribution.EXPONENTIAL] = get_exponential_distribution_function(mode)
    p = get_geometric_p_by_expected_value(mode)
    if p > 0 and p < 1:
        result[StandartDistribution.GEOMETRIC] = get_geometric_distribution_function(p)
    result[StandartDistribution.UNIFORM] = get_uniform_distribution_function(*get_uniform_low_high(mode, variance))
    result[StandartDistribution.BINOMIAL] = get_binomial_distribution_function(get_binomial_p_by_expected_value(mode, len(sorted_distribution)), len(sorted_distribution))

    return result


def get_distribution(generated_distributions, distribution, alpha):
    starting_distribution = get_distribution_function_t(distribution)

    for name, function in generated_distributions.items():
        statistics = get_colmogorov_statistics(function, starting_distribution, distribution)
        p_value = get_p_value(statistics)

        if is_correct(p_value, alpha):
            return name, starting_distribution

    return None, starting_distribution